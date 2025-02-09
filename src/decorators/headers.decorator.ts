import { SWAGGER_METADATA } from "@thanhhoajs/swagger";

/**
 * Decorator to add a header parameter to the operation metadata for a controller method.
 *
 * @param options - An object containing details about the header parameter.
 *                  - `name`: The name of the header parameter.
 *                  - `description`: (Optional) A brief description of the parameter.
 *                  - `required`: (Optional) A boolean indicating if the parameter is required.
 *                  - `schema`: (Optional) The schema defining the type and format of the parameter.
 *
 * @returns A decorator function that adds the header parameter metadata to the target method or class.
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
 * Decorator to add a cookie parameter to the operation metadata for a controller method.
 *
 * @param options - An object containing details about the cookie parameter.
 *                  - `name`: The name of the cookie parameter.
 *                  - `description`: (Optional) A brief description of the parameter.
 *                  - `required`: (Optional) A boolean indicating if the parameter is required.
 *                  - `schema`: (Optional) The schema defining the type and format of the parameter.
 *
 * @returns A decorator function that adds the cookie parameter metadata to the target method or class.
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
