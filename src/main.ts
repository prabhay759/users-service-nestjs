import * as requestIp from "request-ip";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import { NestFactory } from "@nestjs/core";
import { PinoLogger } from "nestjs-pino";
import { applyMiddleware } from "./common/middleware/apply";
import { getConnection } from "typeorm";
import { loggerConfig } from "./config/logger.config";

async function bootstrap() {
  const appLogger: PinoLogger = new PinoLogger(loggerConfig());
  const app = await NestFactory.create(AppModule, { logger: new Logger(appLogger, { renameContext: "app-init" }) });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.use(requestIp.mw());
  applyMiddleware(app);

  // The service will start and will be available for livecheck. Migration will scripts continue to run
  // in the background and exits on error. This is done to deal with the long running migrations.
  const migrationLogger = app.get(Logger);
  getConnection()
    .runMigrations()
    .then(() => migrationLogger.log("Database migrations finished"))
    .catch(error => {
      migrationLogger.error(`Failed to apply migrations scripts ${error.message}`, error.stack);

      // Terminates the application (including NestApplication,
      // connected database).
      app.close();
    });

  const options = new DocumentBuilder()
    .setTitle("Users Service")
    .setDescription("Users Service")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(process.env.APP_PORT || 80);
}

bootstrap();
