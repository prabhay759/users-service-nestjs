import { PipeTransform } from "@nestjs/common";
import { createTaggedValidationPipe } from "./tagged-validation.pipe";

export function createGlobalPipes(): PipeTransform<any>[] {
  return [createTaggedValidationPipe()];
}
