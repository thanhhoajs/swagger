import {
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  SWAGGER_METADATA,
} from "@thanhhoajs/swagger";

/**
 * Decorator to set operation metadata for a controller method.
 *
 * @param metadata - Operation metadata to set.
 *
 * @returns A decorator function that sets the operation metadata on the controller method.
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
 * Decorator to set tags metadata for a controller or method.
 *
 * @param tags - A list of tags to be associated with the controller or method.
 *
 * @returns A decorator function that sets the tags metadata on the target.
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
 * Decorator to add a parameter to the operation metadata for a controller method.
 *
 * @param param - Partial parameter object containing details about the parameter.
 *                The parameter will be added to the "path" location in the operation metadata.
 *
 * @returns A decorator function that adds the parameter metadata to the target method.
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
