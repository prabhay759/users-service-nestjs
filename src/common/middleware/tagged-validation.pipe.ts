import * as _ from "lodash";
import { ValidationPipe, ValidationPipeOptions } from "@nestjs/common";

export function createTaggedValidationPipe(): ValidationPipe {
  const disableErrorMessages = false;
  const options: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages,
  };
  return new ValidationPipe({ ...options });
}
