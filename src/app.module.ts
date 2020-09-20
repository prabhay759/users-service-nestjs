import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module";
import { LoggerModule } from "nestjs-pino";
import { Module } from "@nestjs/common";
import { loggerConfig } from "./config/logger.config";

@Module({
  imports: [ConfigModule.forRoot(), LoggerModule.forRoot(loggerConfig()), HealthModule],
})
export class AppModule {}
