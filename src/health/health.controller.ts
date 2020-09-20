import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

export const healthEndpoint = "health";
export const livenessEndpoint = "liveness";

@ApiTags("Health")
@Controller()
export class HealthController {
  constructor(private health: HealthCheckService, private db: TypeOrmHealthIndicator) {}

  @Get(healthEndpoint)
  @HealthCheck()
  @ApiOperation({ summary: "Health check - includes a database check" })
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => this.db.pingCheck("database", { timeout: 300 }),
    ]);
  }

  @Get(livenessEndpoint)
  @ApiOperation({ summary: "Liveness check for Kubernetes" })
  @ApiResponse({
    status: 200,
    description: "OK",
    schema: {
      type: "object",
      example: {
        status: "ok",
        details: {},
      },
      properties: {
        status: {
          enum: ["ok"],
          type: "string",
        },
        details: {
          type: "object",
        },
      },
    },
  })
  liveness(): HealthCheckResult {
    return { status: "ok", details: {} };
  }
}
