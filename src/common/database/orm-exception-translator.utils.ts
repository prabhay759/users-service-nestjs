import { BadRequestException } from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { TaggedBadRequestException } from "../validation/tagged-bad-request.exception";
import { ValidationTag } from "../validation/types";

export function translateDatabaseException(
  e: Error | QueryFailedError,
): Error | BadRequestException | QueryFailedError {
  if (e instanceof QueryFailedError) {
    if (e.message.includes("violates unique constraint")) {
      return new TaggedBadRequestException("Unique constraint violation", ValidationTag.unique_constraint_violation);
    }
  }
  return e;
}

export async function withExceptionsTranslated<T>(f: () => Promise<T>): Promise<T> {
  try {
    return await f();
  } catch (e) {
    throw translateDatabaseException(e);
  }
}
