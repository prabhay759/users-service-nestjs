import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { getClientIp } from "request-ip";

export const IpAddress = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (request.clientIp) return request.clientIp;
  return getClientIp(request);
});
