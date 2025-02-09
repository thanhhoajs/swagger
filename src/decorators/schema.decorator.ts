import {
  SchemaObject,
  ReferenceObject,
  SWAGGER_METADATA,
} from "@thanhhoajs/swagger";

/**
 * Decorator to add property metadata to a class.
 *
 * @param metadata - Partial schema object containing additional metadata
 *                   about the property. The "type" property is automatically
 *                   set based on the TypeScript type of the property.
 *
 * @returns A decorator function that adds the property metadata to the class.
 */
export function ApiProperty(metadata: Partial<SchemaObject> = {}) {
  return (target: any, propertyKey: string) => {
    const constructor = target.constructor;
    const propertyType = Reflect.getMetadata(
      "design:type",
      target,
      propertyKey,
    );
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, constructor) || {};
    const properties = existingMetadata.properties || {};

    // Handle array types
    if (propertyType === Array) {
      properties[propertyKey] = {
        type: "array",
        items: {
          type: "string", // Default to string if no item type is specified
          ...metadata.items,
        },
        ...metadata,
      };
    } else {
      properties[propertyKey] = {
        ...getSchemaForType(propertyType),
        ...metadata,
      };
    }

    const updatedMetadata = {
      ...existingMetadata,
      type: "object",
      properties,
    };

    Reflect.defineMetadata(SWAGGER_METADATA, updatedMetadata, constructor);
    Reflect.defineMetadata(
      SWAGGER_METADATA,
      updatedMetadata,
      constructor.prototype,
    );
  };
}

function getSchemaForType(type: any): Partial<SchemaObject> | ReferenceObject {
  if (!type) return {};

  // Handle primitive types
  switch (type) {
    case String:
      return { type: "string" };
    case Number:
      return { type: "number" };
    case Boolean:
      return { type: "boolean" };
    case Date:
      return { type: "string", format: "date-time" };
    case Array:
      return { type: "array", items: {} };
  }

  // Handle class types (references)
  if (type.prototype) {
    const typeName = type.name;
    // Register type in global schema registry
    const globalScope = global as any;
    if (!globalScope.__swagger_schemas) {
      globalScope.__swagger_schemas = new Map();
    }
    if (!globalScope.__swagger_schemas.has(typeName)) {
      globalScope.__swagger_schemas.set(typeName, type);
    }
    return { $ref: `#/components/schemas/${typeName}` } as ReferenceObject;
  }

  return {};
}

/**
 * Decorator to add model metadata to a class.
 *
 * @param metadata - Partial schema object containing additional metadata
 *                   about the model. The "type" property is automatically
 *                   set to "object" and merged with existing properties.
 *
 * This decorator updates the class and its prototype with the provided
 * metadata and registers the class in a global schema registry for schema
 * generation.
 */

export function ApiModel(metadata: Partial<SchemaObject> = {}) {
  return (target: any) => {
    // Get existing metadata
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target) || {};
    const properties = existingMetadata.properties || {};

    // Store metadata on both constructor and prototype
    const updatedMetadata = {
      ...metadata,
      type: "object",
      properties,
    };

    Reflect.defineMetadata(SWAGGER_METADATA, updatedMetadata, target);
    Reflect.defineMetadata(SWAGGER_METADATA, updatedMetadata, target.prototype);

    // Add class to global registry to ensure it's available for schema generation
    const globalScope = global as any;
    if (!globalScope.__swagger_schemas) {
      globalScope.__swagger_schemas = new Map();
    }
    globalScope.__swagger_schemas.set(target.name, target);
  };
}
