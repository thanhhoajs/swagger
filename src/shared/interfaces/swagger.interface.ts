import { ReferenceObject, SchemaObject } from "@thanhhoajs/swagger";

export interface SwaggerConfig {
  path?: string;
  document: any;
}

export interface OpenAPIDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
    [key: string]: any;
  };
  paths: Record<string, any>;
  [key: string]: any;
}

export type SchemaObjectType = SchemaObject | ReferenceObject;
