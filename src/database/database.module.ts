import { LoggerModule, PinoLogger } from "nestjs-pino";
import { Module } from "@nestjs/common";
import { PinoTypeormLogger } from "./pino-typeorm.logger";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "../config/database.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [LoggerModule],
      inject: [PinoLogger],
      useFactory: (log: PinoLogger) =>
        databaseConfig({ logger: new PinoTypeormLogger(log, ["error", "schema", "migration"]) }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
