import {
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject,
  ReferenceObject,
  SWAGGER_METADATA,
} from "@thanhhoajs/swagger";

/**
 * Decorator that adds OpenAPI operation metadata to a controller method.
 *
 * @param metadata - Operation metadata compliant with OpenAPI specification
 */
export function ApiOperation(metadata: Partial<OperationObject>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};
    Reflect.defineMetadata(
      SWAGGER_METADATA,
      {
        ...existingMetadata,
        operation: metadata,
      },
      target,
      propertyKey,
    );
  };
}

/**
 * Decorator that adds OpenAPI tags to group operations together.
 * Can be applied to controllers (for all methods) or individual methods.
 *
 * @param tags - Array of tag names to apply
 */
export function ApiTags(...tags: string[]) {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) {
    const metadata = {
      tags: [...tags],
    };

    if (propertyKey && descriptor) {
      // Method decorator
      const existingMetadata =
        Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};
      Reflect.defineMetadata(
        SWAGGER_METADATA,
        {
          ...existingMetadata,
          ...metadata,
        },
        target,
        propertyKey,
      );
    } else {
      // Class decorator
      const existingMetadata =
        Reflect.getMetadata(SWAGGER_METADATA, target) || {};
      Reflect.defineMetadata(
        SWAGGER_METADATA,
        {
          ...existingMetadata,
          ...metadata,
        },
        target,
      );
    }
  };
}

/**
 * Decorator that adds path parameter metadata to an operation.
 *
 * @param param - Parameter configuration object
 * @param param.name - Name of the parameter
 * @param param.description - Description of the parameter
 * @param param.required - Whether parameter is required (default: true for path params)
 * @param param.schema - OpenAPI schema defining the parameter type
 */
export function ApiParam(param: Partial<ParameterObject>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};
    const parameters = existingMetadata.parameters || [];
    parameters.push({ ...param, in: "path" });

    Reflect.defineMetadata(
      SWAGGER_METADATA,
      {
        ...existingMetadata,
        parameters,
      },
      target,
      propertyKey,
    );
  };
}

/**
 * Decorator to add a query parameter to the operation metadata for a controller method.
 *
 * @param param - Partial parameter object containing details about the parameter.
 *                The parameter will be added to the "query" location in the operation metadata.
 *
 * @returns A decorator function that adds the parameter metadata to the target method.
 */
export function ApiQuery(param: Partial<ParameterObject>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};
    const parameters = existingMetadata.parameters || [];
    parameters.push({ ...param, in: "query" });

    Reflect.defineMetadata(
      SWAGGER_METADATA,
      {
        ...existingMetadata,
        parameters,
      },
      target,
      propertyKey,
    );
  };
}

/**
 * Decorator to add request body metadata to a controller method.
 *
 * @param metadata - Partial request body object containing details about the request body.
 *                   This metadata will be added to the operation metadata for the target method.
 *
 * @returns A decorator function that sets the request body metadata on the method.
 */

function getSchemaFromType(type: any): SchemaObject | ReferenceObject {
  const typeMap = {
    [String.name]: { type: "string" },
    [Number.name]: { type: "number" },
    [Boolean.name]: { type: "boolean" },
    [Date.name]: { type: "string", format: "date-time" },
    [Object.name]: { type: "object" },
  };

  if (!type) return {};

  // Handle arrays
  if (Array.isArray(type) || type === Array) {
    const itemType = type.length > 0 ? type[0] : Object;
    return {
      type: "array",
      items: getSchemaFromType(itemType),
    };
  }

  // Handle primitive types
  if (typeMap[type.name]) {
    return typeMap[type.name];
  }

  // Handle class types (DTOs, entities etc)
  if (typeof type === "function" && type.prototype) {
    return { $ref: `#/components/schemas/${type.name}` };
  }

  return { type: "object" };
}

export function ApiBody(options: { type?: any } & Partial<RequestBodyObject>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};

    // Get parameter type from TypeScript metadata if not provided
    const parameterType =
      options.type ||
      Reflect.getMetadata("design:paramtypes", target, propertyKey)?.[0];

    const schema = getSchemaFromType(parameterType);
    const requestBody: Partial<RequestBodyObject> = {
      required: true,
      content: {
        "application/json": { schema },
      },
      ...options,
    };

    Reflect.defineMetadata(
      SWAGGER_METADATA,
      {
        ...existingMetadata,
        requestBody,
      },
      target,
      propertyKey,
    );
  };
}

/**
 * Decorator to add response metadata to a controller method.
 *
 * @param statusCode - HTTP status code for which this response metadata is applicable.
 * @param metadata - Partial response object containing details about the response.
 *                   This metadata will be added to the response metadata for the target method.
 *
 * @returns A decorator function that sets the response metadata on the method.
 */
export function ApiResponse(
  statusCode: number,
  options: { type?: any } & Partial<ResponseObject>,
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};

    // Get return type from TypeScript metadata if not provided
    const returnType =
      options.type ||
      Reflect.getMetadata("design:returntype", target, propertyKey);

    const schema = getSchemaFromType(returnType);
    const response: Partial<ResponseObject> = {
      description: "Successful response",
      content: {
        "application/json": { schema },
      },
      ...options,
    };

    const responses = existingMetadata.responses || {};
    responses[statusCode] = response;

    Reflect.defineMetadata(
      SWAGGER_METADATA,
      {
        ...existingMetadata,
        responses,
      },
      target,
      propertyKey,
    );
  };
}

/**
 * Decorator to add security metadata to a controller or controller method.
 *
 * @param name - Name of the security scheme.
 * @param scopes - List of scopes to include in the security metadata.
 *
 * @returns A decorator function that adds the security metadata to the target.
 */
export function ApiSecurity(name: string, scopes: string[] = []) {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    descriptor?: PropertyDescriptor,
  ) => {
    const security = [{ [name]: scopes }];

    if (descriptor) {
      const existingMetadata =
        Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey!) || {};
      Reflect.defineMetadata(
        SWAGGER_METADATA,
        {
          ...existingMetadata,
          security,
        },
        target,
        propertyKey!,
      );
    } else {
      const existingMetadata =
        Reflect.getMetadata(SWAGGER_METADATA, target) || {};
      Reflect.defineMetadata(
        SWAGGER_METADATA,
        {
          ...existingMetadata,
          security,
        },
        target,
      );
    }
  };
}
