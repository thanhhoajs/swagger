import { describe, expect, it } from "bun:test";
import { ApiOperation, ApiTags } from "@thanhhoajs/swagger";
import { Controller, Get, Module } from "@thanhhoajs/thanhhoa";

import { SwaggerExplorer } from "../src/explorer/swagger.explorer";

describe("SwaggerExplorer", () => {
  it("should explore empty modules array", () => {
    const explorer = new SwaggerExplorer();
    const result = explorer.explore([]);
    expect(result.paths).toEqual({});
    expect(result.components?.schemas).toEqual({});
  });

  it("should explore module with decorated controller", () => {
    @Controller("test")
    @ApiTags("Test")
    class TestController {
      @Get()
      @ApiOperation({ summary: "Test endpoint" })
      test() {
        return "test";
      }
    }

    @Module({
      controllers: [TestController],
    })
    class TestModule {}

    const explorer = new SwaggerExplorer();
    const result = explorer.explore([TestModule]);

    expect(result.paths).toHaveProperty("/test");
    expect(result.paths!!["/test"].get).toBeDefined();
    expect(result.paths!!["/test"].get!!.tags).toContain("Test");
    expect(result.paths!!["/test"].get?.summary).toBe("Test endpoint");
  });

  it("should handle multiple HTTP methods", () => {
    @Controller("users")
    class UserController {
      @Get("")
      @ApiOperation({ summary: "Get users" })
      getUsers() {
        return [];
      }

      @Get(":id")
      @ApiOperation({ summary: "Get user by id" })
      getUser() {
        return {};
      }
    }

    @Module({
      controllers: [UserController],
    })
    class UserModule {}

    const explorer = new SwaggerExplorer();
    const result = explorer.explore([UserModule]);

    // Debug output
    console.log("Paths:", JSON.stringify(result.paths, null, 2));

    // Test paths existence
    expect(result.paths).toBeDefined();
    expect(Object.keys(result.paths!!).length).toBeGreaterThan(0);

    // Test specific paths
    expect(result.paths).toHaveProperty("/users");
    expect(result.paths!!["/users"]).toHaveProperty("get");
    expect(result.paths!!["/users/:id"]).toHaveProperty("get");

    // Test path content
    expect(result.paths!!["/users"].get).toMatchObject({
      summary: "Get users",
      responses: expect.any(Object),
    });

    expect(result.paths!!["/users/:id"].get).toMatchObject({
      summary: "Get user by id",
      responses: expect.any(Object),
    });
  });
});
