import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/health (GET)", () => {
    return request(app.getHttpServer())
      .get("/health")
      .expect(HttpStatus.OK);
  });
});
