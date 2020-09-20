import * as testRequest from "supertest";
import { Abstract } from "@nestjs/common/interfaces/abstract.interface";
import { Application } from "express";
import { DynamicModule } from "@nestjs/common/interfaces/modules/dynamic-module.interface";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { INestApplication, ModuleMetadata } from "@nestjs/common/interfaces";
import { LoggerModule } from "nestjs-pino/dist";
import { Test as STest, SuperTest } from "supertest";
import { Test } from "@nestjs/testing";
import { Type } from "@nestjs/common/interfaces/type.interface";
import { applyMiddleware } from "../../../common/middleware/apply";
import { getRepositoryToken } from "@nestjs/typeorm";
import { loggerConfig } from "../../../config/logger.config";

export class TestingApp {
  private requestCache: SuperTest<STest>;

  constructor(public app: INestApplication) {}

  request(): SuperTest<STest> {
    if (!this.requestCache) {
      const express: Application = this.app.getHttpServer();
      const server = express.listen();
      this.requestCache = testRequest(server);
    }
    return this.requestCache;
  }

  get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | Abstract<TInput> | string | symbol): TResult {
    return this.app.get(typeOrToken);
  }

  getRepository<T>(entity: EntityClassOrSchema): T {
    return this.get(getRepositoryToken(entity));
  }

  async close(): Promise<void> {
    return await this.app.close();
  }
}

export async function forModuleMetadata(moduleMeta: ModuleMetadata): Promise<TestingApp> {
  const module = await Test.createTestingModule(moduleMeta).compile();
  await module.init();
  let nestApp = await module.createNestApplication();
  nestApp = applyMiddleware(nestApp);
  nestApp.init();
  return new TestingApp(nestApp);
}

export async function forModuleClass(
  ...modules: (Type<any> | DynamicModule | Promise<DynamicModule>)[]
): Promise<TestingApp> {
  return await forModuleMetadata({ imports: [LoggerModule.forRoot(loggerConfig()), ...modules] });
}
