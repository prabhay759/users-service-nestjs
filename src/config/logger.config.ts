import * as pino from "pino";

import { healthEndpoint, livenessEndpoint } from "../health/health.controller";

import { Params } from "nestjs-pino";

const level = "info";
export const XRequestId = "X-Request-ID";
export const serviceName = "users-service";
export function loggerConfig(): Params {
  return {
    pinoHttp: {
      level: process.env.LOG_LEVEL || level,
      useLevel: level, // The level to log request/response at
      prettyPrint: true,
      autoLogging: {
        ignorePaths: [`/${healthEndpoint}`, `/${livenessEndpoint}`],
      },
      formatters: {
        // print log level as a string instead of an internal numeric ID
        level: (name: string): { level: string } => ({ level: name }),
        // delete hostname from the logs. it accepts a { pid, hostname } object,
        // and its return then gets merged with the object being logged.
        bindings: ({ pid }): { pid: number } => ({ pid }),
      },
      timestamp: pino.stdTimeFunctions.isoTime, // print timestamps in ISO8601 instead of a number
      messageKey: "message", // defaults to msg
      // Avoid logging authorization header
      redact: ["req.headers.authorization"],
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      reqCustomProps: req => ({
        [XRequestId]: req.headers[XRequestId.toLowerCase()],
        service: serviceName,
      }),
    },
  };
}
