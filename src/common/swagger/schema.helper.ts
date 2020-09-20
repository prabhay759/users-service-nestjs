import { ModelPropertiesAccessor } from "@nestjs/swagger/dist/services/model-properties-accessor";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { SchemaObjectFactory } from "@nestjs/swagger/dist/services/schema-object-factory";
import { SwaggerTypesMapper } from "@nestjs/swagger/dist/services/swagger-types-mapper";
import { Type } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";

const schemaFactory = new SchemaObjectFactory(new ModelPropertiesAccessor(), new SwaggerTypesMapper());

function buildSchema<T>(target: Type<T>): SchemaObject {
  const result = [];
  schemaFactory.exploreModelSchema(target, result, []);
  return result?.[0]?.[target.name];
}

/**
 * Swagger cannot build a response schema for a generic response type.
 * This function is our attempt at casting it a helping hand by specifying the concrete
 * return type of the generic response wrapper.
 */
export function responseSchema<W, T>(wrapper: Type<W>, field: keyof W, type: Type<T>): SchemaObject {
  const wrapperSchema = buildSchema(wrapper);
  wrapperSchema.properties[field as string] = { $ref: getSchemaPath(type) };
  return wrapperSchema;
}

/**
 * Swagger cannot build a response schema for a generic response type.
 * This is a `responseSchema` version that returns an array of `itemType` instead of just a single nested element.
 */
export function arrayResponseSchema<W, T>(wrapper: Type<W>, field: keyof W, itemType: Type<T>): SchemaObject {
  const wrapperSchema = buildSchema(wrapper);
  wrapperSchema.properties[field as string] = { type: "array", items: { $ref: getSchemaPath(itemType) } };
  return wrapperSchema;
}
