/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { LoggerOptions } from "typeorm/logger/LoggerOptions";
import { PinoLogger } from "nestjs-pino/dist";
import { QueryRunner, Logger as TypeormLogger } from "typeorm";

export class PinoTypeormLogger implements TypeormLogger {
  constructor(private logger: PinoLogger, private options?: LoggerOptions) {}

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[]) {
    if (
      this.options === "all" ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.indexOf("query") !== -1)
    ) {
      const sql =
        query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
      this.logger.info("query: %s", sql);
    }
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(error: string, query: string, parameters?: any[]) {
    if (
      this.options === "all" ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.indexOf("error") !== -1)
    ) {
      const sql =
        query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
      this.logger.error(`query failed: %s`, sql);
      this.logger.error(`error: %s`, error);
    }
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
    this.logger.warn(`query is slow: %s`, sql);
    this.logger.warn(`execution time: %s`, time);
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string) {
    if (this.options === "all" || (Array.isArray(this.options) && this.options.indexOf("schema") !== -1)) {
      this.logger.info(message);
    }
  }

  /**
   * Logs events from the migration run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message);
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: "log" | "info" | "warn", message: any) {
    switch (level) {
      case "log":
        if (this.options === "all" || (Array.isArray(this.options) && this.options.indexOf("log") !== -1))
          this.logger.info(message);
        break;
      case "info":
        if (this.options === "all" || (Array.isArray(this.options) && this.options.indexOf("info") !== -1))
          this.logger.info("INFO: %s", message);
        break;
      case "warn":
        if (this.options === "all" || (Array.isArray(this.options) && this.options.indexOf("warn") !== -1))
          this.logger.warn(message);
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
