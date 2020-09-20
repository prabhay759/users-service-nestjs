import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { NestFactory } from "@nestjs/core";
import { PinoLogger } from "nestjs-pino";
import { applyMiddleware } from "./common/middleware/apply";
import { loggerConfig } from "./config/logger.config";

async function bootstrap() {
  const appLogger: PinoLogger = new PinoLogger(loggerConfig());
  const app = await NestFactory.create(AppModule, { logger: new Logger(appLogger, { renameContext: "app-init" }) });
  const logger = app.get(Logger);
  app.useLogger(logger);
  applyMiddleware(app);
  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
