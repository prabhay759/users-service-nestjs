import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { arrayResponseSchema, responseSchema } from "./schema.helper";

describe("Swagger schema helpers", () => {
  describe("responseSchema", () => {
    it("should place the schema in the right place in the wrapping class", () => {
      class Tester {
        @ApiProperty({ example: "John Johnson" })
        name: string;
      }
      class Wrap<T> {
        @ApiProperty({ type: "object" })
        nestedValue: T;

        @ApiProperty({ example: "10", description: "The page number of the nestedValue" })
        page: number;
      }

      const schema = responseSchema(Wrap, "nestedValue", Tester);
      expect(schema).toMatchObject({
        properties: {
          nestedValue: { $ref: getSchemaPath(Tester) },
          page: expect.objectContaining({
            type: "number",
            example: "10",
            description: "The page number of the nestedValue",
          }),
        },
      });
    });
  });
  describe("arrayResponseSchema", () => {
    it("should place the schema in the right place in the wrapping class as an array", () => {
      class Tester {
        @ApiProperty({ example: "John Johnson" })
        name: string;
      }
      class Wrap<T> {
        @ApiProperty({ type: "object" })
        nestedValue: T;

        @ApiProperty({ example: "10", description: "The page number of the nestedValue" })
        page: number;
      }

      const schema = arrayResponseSchema(Wrap, "nestedValue", Tester);
      expect(schema).toMatchObject({
        properties: {
          nestedValue: { type: "array", items: { $ref: getSchemaPath(Tester) } },
          page: expect.objectContaining({
            type: "number",
            example: "10",
            description: "The page number of the nestedValue",
          }),
        },
      });
    });
  });
});
