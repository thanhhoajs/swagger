import { ModuleMetadata, ThanhHoa, container } from "@thanhhoajs/thanhhoa";
import { SwaggerConfig } from "@thanhhoajs/swagger";

import { SwaggerModule } from "../module/swagger.module";
import { SwaggerService } from "../module/swagger.service";

/**
 * Initializes and configures Swagger/OpenAPI documentation for a ThanhHoa application.
 *
 * @param app - ThanhHoa application instance
 * @param config - Swagger configuration
 * @param config.path - URL path where Swagger UI will be served (default: "docs")
 * @param config.document - Base OpenAPI document (title, version, etc.)
 * @param modules - Array of application modules to scan for API documentation
 *
 * @example
 * ```typescript
 * const app = new ThanhHoa();
 *
 * setupSwagger(app, {
 *   path: '/api/docs',
 *   document: {
 *     openapi: '3.0.0',
 *     info: {
 *       title: 'My API',
 *       version: '1.0.0'
 *     }
 *   }
 * }, [UsersModule, AuthModule]);
 * ```
 */
export const setupSwagger = (
  app: ThanhHoa,
  config: SwaggerConfig,
  modules: ModuleMetadata[] = [],
) => {
  // Register swagger module
  app.registerModule(SwaggerModule);

  // Get swagger service instance
  const swaggerService = container.resolve<SwaggerService>(SwaggerService.name);

  // Configure swagger
  swaggerService.setConfig(config);

  // Generate documentation first
  swaggerService.generateDocument(modules);

  // Then set the complete document
  const completeDocument = {
    ...config.document,
    paths: swaggerService.getPaths(),
    components: {
      ...config.document.components,
      ...swaggerService.getComponents(),
    },
  };
  swaggerService.setDocument(completeDocument);

  const path = config.path || "docs";

  // Register routes
  app.get(`${path}/swagger.json`, (ctx) => swaggerService.serveJSON(ctx));
  app.get(path, (ctx) => swaggerService.serveUI(ctx));
};
