import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";

export class Response<T> {
  @ValidateNested()
  @ApiProperty({ type: "object", example: "{ /* ...the relevant API response */ }" })
  data: T;

  static forData<T>(data: T): Response<T> {
    return Object.assign(new Response<T>(), { data });
  }
}
