import { ClassSerializerInterceptor, NestInterceptor } from "@nestjs/common";
import { XRequestIDInterceptor } from "./x-request-id.interceptor";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createGlobalInterceptors(reflector: any): NestInterceptor[] {
  return [new ClassSerializerInterceptor(reflector), new XRequestIDInterceptor()];
}
