import { OpenAPIDocument } from "@thanhhoajs/swagger";
import { describe, expect, it } from "bun:test";

import { SwaggerService } from "../src/module/swagger.service";
import { IRequestContext } from "@thanhhoajs/thanhhoa";

describe("SwaggerService", () => {
  it("should initialize with default values", () => {
    const service = new SwaggerService();
    expect(service.getPaths()).toEqual({});
    expect(service.getComponents()).toEqual({ schemas: {} });
  });

  it("should set document", () => {
    const service = new SwaggerService();
    const doc: OpenAPIDocument = {
      openapi: "3.0.0",
      info: {
        title: "Test API",
        version: "1.0.0",
      },
      paths: {
        "/test": {
          get: {
            responses: {
              "200": {
                description: "OK",
              },
            },
          },
        },
      },
    };

    service.setDocument(doc);
    expect(service.getPaths()).toEqual({});
  });

  it("should throw error for invalid document", () => {
    const service = new SwaggerService();
    const invalidDoc = {} as OpenAPIDocument;

    expect(() => service.setDocument(invalidDoc)).toThrow(
      "Invalid OpenAPI document structure",
    );
  });

  it("should set config", () => {
    const service = new SwaggerService();
    const config = {
      path: "/api-docs",
      document: {
        openapi: "3.0.0",
        info: { title: "Test", version: "1.0" },
        paths: {},
      },
    };

    service.setConfig(config);
    expect(() => service.setConfig({ document: {} as any })).toThrow(
      "Swagger path configuration is required",
    );
  });

  it("should serve UI", async () => {
    const service = new SwaggerService();
    const context = {
      request: new Request("http://localhost/docs"),
    } as IRequestContext;

    const response = await service.serveUI(context);
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("content-type")).toBe("text/html");
  });

  it("should serve JSON", async () => {
    const service = new SwaggerService();
    const context = {
      request: new Request("http://localhost/docs/swagger.json"),
    } as IRequestContext;

    const response = await service.serveJSON(context);
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("content-type")).toBe("application/json");
  });
});
