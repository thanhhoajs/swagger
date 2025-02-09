import { SWAGGER_METADATA } from "@thanhhoajs/swagger";

/**
 * Defines a header parameter in the OpenAPI documentation.
 *
 * @param options - Header parameter configuration
 * @param options.name - The header name
 * @param options.description - Header description
 * @param options.required - Whether the header is required
 * @param options.schema - Schema defining the header value type
 * @returns MethodDecorator & ClassDecorator
 *
 * @example
 * ```typescript
 * @ApiHeader({
 *   name: 'X-API-Version',
 *   description: 'API version requested',
 *   required: true,
 *   schema: { type: 'string' }
 * })
 * export class Controller {}
 * ```
 */
export function ApiHeader(options: {
  name: string;
  description?: string;
  required?: boolean;
  schema?: any;
}) {
  return (target: any, propertyKey?: string | symbol) => {
    const metadata = Reflect.getMetadata(SWAGGER_METADATA, target) || {};
    const parameters = metadata.parameters || [];
    parameters.push({
      in: "header",
      ...options,
    });
    metadata.parameters = parameters;

    if (propertyKey) {
      Reflect.defineMetadata(SWAGGER_METADATA, metadata, target, propertyKey);
    } else {
      Reflect.defineMetadata(SWAGGER_METADATA, metadata, target);
    }
  };
}

/**
 * Defines a cookie parameter in the OpenAPI documentation.
 *
 * @param options - Cookie parameter configuration
 * @param options.name - The cookie name
 * @param options.description - Cookie description
 * @param options.required - Whether the cookie is required
 * @param options.schema - Schema defining the cookie value type
 * @returns MethodDecorator & ClassDecorator
 *
 * @example
 * ```typescript
 * @ApiCookieParam({
 *   name: 'sessionId',
 *   description: 'Session identifier',
 *   required: true,
 *   schema: { type: 'string' }
 * })
 * async getUser() {}
 * ```
 */
export function ApiCookieParam(options: {
  name: string;
  description?: string;
  required?: boolean;
  schema?: any;
}) {
  return (target: any, propertyKey?: string | symbol) => {
    const metadata = Reflect.getMetadata(SWAGGER_METADATA, target) || {};
    const parameters = metadata.parameters || [];
    parameters.push({
      in: "cookie",
      ...options,
    });
    metadata.parameters = parameters;

    if (propertyKey) {
      Reflect.defineMetadata(SWAGGER_METADATA, metadata, target, propertyKey);
    } else {
      Reflect.defineMetadata(SWAGGER_METADATA, metadata, target);
    }
  };
}
