import { INestApplication } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { createGlobalInterceptors } from "./interceptors.middleware";

export function applyMiddleware<T extends INestApplication>(app: T): T {
  app.useGlobalInterceptors(...createGlobalInterceptors(app.get(Reflector)));

  return app;
}
