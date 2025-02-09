import { SWAGGER_METADATA } from "@thanhhoajs/swagger";

/**
 * Decorator to add basic auth security metadata to a controller or controller method.
 *
 * @param options - An object with a single property, `description`, which is an optional
 *                  description of the security scheme.
 *
 * @returns A decorator function that adds the security metadata to the target.
 */
export function ApiBasicAuth(options: { description?: string } = {}) {
  return (target: any) => {
    const metadata = {
      components: {
        securitySchemes: {
          basicAuth: {
            type: "http",
            scheme: "basic",
            ...options,
          },
        },
      },
      security: [{ basicAuth: [] }],
    };
    Reflect.defineMetadata(SWAGGER_METADATA, metadata, target);
  };
}

/**
 * Decorator to add bearer auth security metadata to a controller or controller method.
 *
 * @param options - An object with a single property, `description`, which is an optional
 *                  description of the security scheme.
 *
 * @returns A decorator function that adds the security metadata to the target.
 */
export function ApiBearerAuth(options: { description?: string } = {}) {
  return (target: any) => {
    const metadata = {
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            ...options,
          },
        },
      },
      security: [{ bearerAuth: [] }],
    };
    Reflect.defineMetadata(SWAGGER_METADATA, metadata, target);
  };
}

/**
 * Decorator to add OAuth2 security metadata to a controller or controller method.
 *
 * @param flows - An object containing the OAuth2 flows to support. The object should have
 *                one or more of the following properties:
 *                - `implicit`: An object with properties `authorizationUrl` and `scopes`.
 *                - `password`: An object with properties `tokenUrl` and `scopes`.
 *                - `clientCredentials`: An object with properties `tokenUrl` and `scopes`.
 *                - `authorizationCode`: An object with properties `authorizationUrl`,
 *                                       `tokenUrl`, and `scopes`.
 *
 * @returns A decorator function that adds the security metadata to the target.
 */
export function ApiOAuth2(flows: {
  implicit?: any;
  password?: any;
  clientCredentials?: any;
  authorizationCode?: any;
}) {
  return (target: any) => {
    const metadata = {
      components: {
        securitySchemes: {
          oauth2: {
            type: "oauth2",
            flows,
          },
        },
      },
      security: [{ oauth2: [] }],
    };
    Reflect.defineMetadata(SWAGGER_METADATA, metadata, target);
  };
}
