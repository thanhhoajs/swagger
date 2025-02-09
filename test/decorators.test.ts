import { describe, expect, it } from "bun:test";
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiModel,
  ApiProperty,
  SWAGGER_METADATA,
  ApiHeader,
  ApiBearerAuth,
  ApiOAuth2,
  ApiBasicAuth,
  ApiCookieParam,
} from "@thanhhoajs/swagger";

describe("Swagger Decorators", () => {
  describe("@ApiModel", () => {
    it("should set model metadata", () => {
      @ApiModel({
        description: "Test Model",
      })
      class TestModel {}

      const metadata = Reflect.getMetadata(SWAGGER_METADATA, TestModel);
      expect(metadata).toHaveProperty("description", "Test Model");
      expect(metadata).toHaveProperty("type", "object");
    });
  });

  describe("@ApiProperty", () => {
    it("should set property metadata", () => {
      class TestClass {
        @ApiProperty({
          type: "string",
          description: "Test property",
        })
        testProp: string;
      }

      const metadata = Reflect.getMetadata(SWAGGER_METADATA, TestClass);
      expect(metadata.properties.testProp).toHaveProperty(
        "description",
        "Test property",
      );
      expect(metadata.properties.testProp).toHaveProperty("type", "string");
    });

    it("should handle array types", () => {
      class TestClass {
        @ApiProperty({
          type: "array",
          items: {
            type: "string",
          },
        })
        testArray: string[];
      }

      const metadata = Reflect.getMetadata(SWAGGER_METADATA, TestClass);
      expect(metadata.properties.testArray).toHaveProperty("type", "array");
      expect(metadata.properties.testArray.items).toHaveProperty(
        "type",
        "string",
      );
    });
  });

  describe("Operation Decorators", () => {
    it("@ApiOperation should set operation metadata", () => {
      class TestController {
        @ApiOperation({ summary: "Test operation" })
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(
        SWAGGER_METADATA,
        TestController.prototype,
        "testMethod",
      );
      expect(metadata.operation).toHaveProperty("summary", "Test operation");
    });

    it("@ApiTags should set tags metadata", () => {
      @ApiTags("test")
      class TestController {}

      const metadata = Reflect.getMetadata(SWAGGER_METADATA, TestController);
      expect(metadata.tags).toContain("test");
    });

    it("@ApiParam should set parameter metadata", () => {
      class TestController {
        @ApiParam({
          name: "id",
          type: "string",
        })
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(
        SWAGGER_METADATA,
        TestController.prototype,
        "testMethod",
      );
      expect(metadata.parameters[0]).toHaveProperty("name", "id");
      expect(metadata.parameters[0]).toHaveProperty("in", "path");
    });

    it("@ApiBody should set request body metadata", () => {
      class TestController {
        @ApiBody({
          description: "Test body",
          required: true,
        })
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(
        SWAGGER_METADATA,
        TestController.prototype,
        "testMethod",
      );
      expect(metadata.requestBody).toHaveProperty("description", "Test body");
      expect(metadata.requestBody).toHaveProperty("required", true);
    });

    it("@ApiResponse should set response metadata", () => {
      class TestController {
        @ApiResponse(200, {
          description: "Success response",
        })
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(
        SWAGGER_METADATA,
        TestController.prototype,
        "testMethod",
      );
      expect(metadata.responses["200"]).toHaveProperty(
        "description",
        "Success response",
      );
    });
  });

  describe("Header Decorators", () => {
    it("@ApiHeader should set header parameter metadata", () => {
      class TestController {
        @ApiHeader({
          name: "X-API-KEY",
          description: "API Key for authentication",
          required: true,
        })
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(
        SWAGGER_METADATA,
        TestController.prototype,
        "testMethod",
      );
      expect(metadata.parameters[0]).toHaveProperty("name", "X-API-KEY");
      expect(metadata.parameters[0]).toHaveProperty("in", "header");
      expect(metadata.parameters[0]).toHaveProperty("required", true);
    });

    it("@ApiCookieParam should set cookie parameter metadata", () => {
      class TestController {
        @ApiCookieParam({
          name: "session",
          description: "Session cookie",
          required: true,
        })
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(
        SWAGGER_METADATA,
        TestController.prototype,
        "testMethod",
      );
      expect(metadata.parameters[0]).toHaveProperty("name", "session");
      expect(metadata.parameters[0]).toHaveProperty("in", "cookie");
      expect(metadata.parameters[0]).toHaveProperty("required", true);
    });
  });

  describe("Security Decorators", () => {
    it("@ApiBasicAuth should set basic auth security metadata", () => {
      @ApiBasicAuth({ description: "Basic Auth" })
      class TestController {}

      const metadata = Reflect.getMetadata(SWAGGER_METADATA, TestController);
      expect(metadata.components.securitySchemes.basicAuth).toEqual({
        type: "http",
        scheme: "basic",
        description: "Basic Auth",
      });
      expect(metadata.security).toEqual([{ basicAuth: [] }]);
    });

    it("@ApiBearerAuth should set bearer auth security metadata", () => {
      @ApiBearerAuth({ description: "JWT Auth" })
      class TestController {}

      const metadata = Reflect.getMetadata(SWAGGER_METADATA, TestController);
      expect(metadata.components.securitySchemes.bearerAuth).toEqual({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Auth",
      });
      expect(metadata.security).toEqual([{ bearerAuth: [] }]);
    });

    it("@ApiOAuth2 should set OAuth2 security metadata", () => {
      @ApiOAuth2({
        implicit: {
          authorizationUrl: "https://example.com/auth",
          scopes: {
            read: "Read access",
            write: "Write access",
          },
        },
      })
      class TestController {}

      const metadata = Reflect.getMetadata(SWAGGER_METADATA, TestController);
      expect(metadata.components.securitySchemes.oauth2).toEqual({
        type: "oauth2",
        flows: {
          implicit: {
            authorizationUrl: "https://example.com/auth",
            scopes: {
              read: "Read access",
              write: "Write access",
            },
          },
        },
      });
      expect(metadata.security).toEqual([{ oauth2: [] }]);
    });
  });
});
