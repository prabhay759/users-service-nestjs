import { LoggerModule, PinoLogger } from "nestjs-pino";
import { Module } from "@nestjs/common";
import { PinoTypeormLogger } from "./pino-typeorm.logger";
import { Transactional } from "./transactional";
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
  providers: [Transactional],
  exports: [Transactional, TypeOrmModule],
})
export class DatabaseModule {}
