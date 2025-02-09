import {
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
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
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    descriptor?: PropertyDescriptor,
  ) => {
    if (descriptor) {
      const existingMetadata =
        Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey!) || {};
      Reflect.defineMetadata(
        SWAGGER_METADATA,
        {
          ...existingMetadata,
          tags,
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
          tags,
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

export function ApiBody(metadata: Partial<RequestBodyObject>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};
    Reflect.defineMetadata(
      SWAGGER_METADATA,
      {
        ...existingMetadata,
        requestBody: metadata,
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
  metadata: Partial<ResponseObject>,
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingMetadata =
      Reflect.getMetadata(SWAGGER_METADATA, target, propertyKey) || {};
    const responses = existingMetadata.responses || {};
    responses[statusCode] = metadata;

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
