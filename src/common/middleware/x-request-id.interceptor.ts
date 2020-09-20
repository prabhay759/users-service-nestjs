import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

/**
 * Copy X-Request-ID from the incoming request to the response.
 */
export class XRequestIDInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const correlationId = context.switchToHttp().getRequest().headers["x-request-id"];
    if (correlationId) {
      context
        .switchToHttp()
        .getResponse()
        .set("X-Request-ID", correlationId);
    }
    return next.handle();
  }
}
