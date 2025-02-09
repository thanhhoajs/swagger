import {
  CONTROLLER_METADATA_KEY,
  ROUTE_METADATA_KEY,
} from "@thanhhoajs/thanhhoa";
import {
  OpenAPIObject,
  PathsObject,
  SchemaObject,
  SWAGGER_METADATA,
  PathItemObject,
  OperationObject,
} from "@thanhhoajs/swagger";

type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

export class SwaggerExplorer {
  private paths: PathsObject = {};
  private schemas: Record<string, SchemaObject> = {};

  explore(modules: any[]): Partial<OpenAPIObject> {
    this.paths = {};
    this.schemas = {};

    // First collect all schemas from global registry
    this.collectGlobalSchemas();

    // Then explore modules
    for (const module of modules) {
      const metadata = Reflect.getMetadata("module", module) || {};
      if (metadata.controllers) {
        for (const controller of metadata.controllers) {
          this.exploreController(controller);
        }
      }
    }

    return {
      paths: this.paths,
      components: {
        schemas: this.schemas,
      },
    };
  }

  private collectGlobalSchemas() {
    const globalScope = global as any;
    const schemaRegistry = globalScope.__swagger_schemas as Map<string, any>;

    if (schemaRegistry) {
      for (const [name, target] of schemaRegistry.entries()) {
        const metadata = Reflect.getMetadata(SWAGGER_METADATA, target) || {};
        if (metadata.properties) {
          this.schemas[name] = {
            type: "object",
            ...metadata,
            properties: this.transformProperties(metadata.properties),
          };
        }
      }
    }
  }

  private transformProperties(
    properties: Record<string, any>,
  ): Record<string, SchemaObject> {
    const transformed: Record<string, SchemaObject> = {};

    for (const [key, prop] of Object.entries(properties)) {
      transformed[key] = {
        ...prop,
        ...(prop.items && {
          items: this.resolveReference(prop.items),
        }),
      };
    }

    return transformed;
  }

  private resolveReference(ref: any): any {
    if (ref.$ref) {
      const refName = ref.$ref.split("/").pop();
      // Ensure referenced schema exists
      if (!this.schemas[refName]) {
        const globalScope = global as any;
        const schemaRegistry = globalScope.__swagger_schemas;
        if (schemaRegistry?.has(refName)) {
          const target = schemaRegistry.get(refName);
          const metadata = Reflect.getMetadata(SWAGGER_METADATA, target) || {};
          this.schemas[refName] = {
            type: "object",
            ...metadata,
            properties: this.transformProperties(metadata.properties || {}),
          };
        }
      }
    }
    return ref;
  }

  private extractModels(modules: any[]) {
    for (const module of modules) {
      const metadata = Reflect.getMetadata("module", module) || {};

      // Extract from controllers
      if (metadata.controllers) {
        for (const controller of metadata.controllers) {
          // Get prototype to find decorated properties
          const prototype = controller.prototype;
          const propertyNames = Object.getOwnPropertyNames(prototype);

          for (const propertyName of propertyNames) {
            if (propertyName === "constructor") continue;

            const methodMetadata =
              Reflect.getMetadata(SWAGGER_METADATA, prototype, propertyName) ||
              {};

            // Extract from response schemas
            if (methodMetadata.responses) {
              Object.values(methodMetadata.responses).forEach(
                (response: any) => {
                  if (response.content) {
                    Object.values(response.content).forEach((content: any) => {
                      this.extractSchemaFromContent(content);
                    });
                  }
                },
              );
            }

            // Extract from request body
            if (methodMetadata.requestBody?.content) {
              Object.values(methodMetadata.requestBody.content).forEach(
                (content: any) => {
                  this.extractSchemaFromContent(content);
                },
              );
            }
          }
        }
      }

      // Extract from providers (services)
      if (metadata.providers) {
        for (const provider of metadata.providers) {
          const providerMetadata =
            Reflect.getMetadata(SWAGGER_METADATA, provider) || {};
          if (providerMetadata.properties) {
            this.schemas[provider.name] = {
              type: "object",
              properties: providerMetadata.properties,
            };
          }
        }
      }
    }
  }

  private extractSchemaFromContent(content: any) {
    if (!content.schema) return;

    if (content.schema.$ref) {
      const schemaName = content.schema.$ref.split("/").pop();
      this.extractSchemaDefinition(schemaName);
    }

    if (content.schema.items?.$ref) {
      const schemaName = content.schema.items.$ref.split("/").pop();
      this.extractSchemaDefinition(schemaName);
    }
  }

  private extractSchemaDefinition(schemaName: string) {
    // Try to find the model class in global scope
    const modelClass = (global as any)[schemaName];
    if (!modelClass) return;

    // Extract class-level metadata
    const classMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, modelClass) || {};

    // Get property-level metadata
    const properties: Record<string, any> = {};
    const prototype = modelClass.prototype;
    const propertyMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, prototype) || {};

    // Merge class and property metadata
    this.schemas[schemaName] = {
      type: "object",
      ...classMetadata,
      properties: {
        ...propertyMetadata.properties,
        ...classMetadata.properties,
      },
    };
  }

  private exploreController(controller: any) {
    const prototype = controller.prototype;
    const basePath =
      Reflect.getMetadata(CONTROLLER_METADATA_KEY, controller) || "";
    const controllerTags = this.getControllerTags(controller);

    // Get all methods from prototype
    const methods = Object.getOwnPropertyNames(prototype).filter(
      (prop) => prop !== "constructor" && typeof prototype[prop] === "function",
    );

    for (const method of methods) {
      const routeMetadata = Reflect.getMetadata(
        ROUTE_METADATA_KEY,
        prototype,
        method,
      );
      if (!routeMetadata) continue;

      const { path: routePath, method: httpMethod } = routeMetadata;
      const swaggerMetadata =
        Reflect.getMetadata(SWAGGER_METADATA, prototype, method) || {};

      // Properly handle empty path and path parameters
      const methodPath =
        routePath === "" ? "" : `/${routePath.replace(/^\/+/, "")}`;
      const fullPath = this.normalizePath(`${basePath}${methodPath}`);

      if (!this.paths[fullPath]) {
        this.paths[fullPath] = {} as PathItemObject;
      }

      // Convert HTTP method to lowercase for Swagger spec
      const methodKey = httpMethod.toLowerCase() as HttpMethod;

      // Type assertion to ensure valid operation assignment
      const operation = {
        tags: [...(controllerTags || []), ...(swaggerMetadata.tags || [])],
        ...swaggerMetadata.operation,
        parameters: [
          ...this.extractPathParameters(fullPath),
          ...(swaggerMetadata.parameters || []),
        ],
        requestBody: swaggerMetadata.requestBody,
        responses: swaggerMetadata.responses || {
          "200": {
            description: "Success",
          },
        },
      } as OperationObject;

      this.paths[fullPath][methodKey] = operation;
    }
  }

  private extractPathParameters(path: string): any[] {
    const params = [];
    const paramRegex = /:([^/]+)/g;
    let match;

    while ((match = paramRegex.exec(path)) !== null) {
      params.push({
        name: match[1],
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      });
    }

    return params;
  }

  private getControllerTags(controller: any): string[] {
    const metadata = Reflect.getMetadata(SWAGGER_METADATA, controller) || {};
    return metadata.tags || [];
  }

  private normalizePath(path: string): string {
    return "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
  }
}
