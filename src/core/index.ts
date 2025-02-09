import { ModuleMetadata, ThanhHoa, container } from "@thanhhoajs/thanhhoa";
import { SwaggerConfig } from "@thanhhoajs/swagger";

import { SwaggerModule } from "../module/swagger.module";
import { SwaggerService } from "../module/swagger.service";

/**
 * Sets up Swagger integration for a ThanhHoa application.
 *
 * @param app - The ThanhHoa application instance.
 * @param config - The configuration for Swagger, including document and path.
 * @param modules - An optional array of module metadata to generate documentation.
 *
 * This function registers the Swagger module, configures it with the provided
 * settings, generates API documentation based on the supplied modules, and
 * sets up routes to serve the Swagger UI and the JSON representation of the API
 * documentation.
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
