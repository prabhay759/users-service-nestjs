import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { LoggerModule } from "nestjs-pino";
import { Module } from "@nestjs/common";
import { loggerConfig } from "./config/logger.config";

@Module({
  imports: [ConfigModule.forRoot(), LoggerModule.forRoot(loggerConfig()), DatabaseModule, HealthModule],
})
export class AppModule {}
