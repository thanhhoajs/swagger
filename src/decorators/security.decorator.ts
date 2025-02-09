import { SWAGGER_METADATA } from "@thanhhoajs/swagger";

/**
 * Adds Basic Authentication security scheme to OpenAPI documentation.
 *
 * @param options - Configuration options for Basic Auth
 * @param options.description - Optional description of how the Basic Auth is used
 * @returns A decorator that can be applied to controllers or methods
 *
 * @example
 * ```typescript
 * @ApiBasicAuth({ description: 'Enter username and password' })
 * export class AuthController {}
 * ```
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
 * Adds Bearer Authentication (JWT) security scheme to OpenAPI documentation.
 *
 * @param options - Configuration options for Bearer Auth
 * @param options.description - Optional description of how the Bearer Auth is used
 * @returns A decorator that can be applied to controllers or methods
 *
 * @example
 * ```typescript
 * @ApiBearerAuth({ description: 'Enter JWT token' })
 * export class SecureController {}
 * ```
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
 * Adds OAuth2 security scheme to OpenAPI documentation.
 *
 * @param flows - OAuth2 flow configurations
 * @param flows.implicit - Implicit flow configuration with authorizationUrl and scopes
 * @param flows.password - Password flow configuration with tokenUrl and scopes
 * @param flows.clientCredentials - Client credentials flow with tokenUrl and scopes
 * @param flows.authorizationCode - Authorization code flow with all URLs and scopes
 * @returns A decorator that can be applied to controllers or methods
 *
 * @example
 * ```typescript
 * @ApiOAuth2({
 *   implicit: {
 *     authorizationUrl: 'https://auth.example.com/oauth/authorize',
 *     scopes: { 'read:users': 'Read users', 'write:users': 'Write users' }
 *   }
 * })
 * export class OAuthController {}
 * ```
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
