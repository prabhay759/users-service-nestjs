import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../database/database.module";
import { Module } from "@nestjs/common";
import { SnsModule } from "src/sns/sns.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersConverter } from "./users.converter";
import { UsersEntity } from "./model/users.entity";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UsersEntity]),
    ConfigModule,
    SnsModule.forRootSnsAsync({
      useFactory: async () => {
        return {
          accessKeyId: "AKIAIOSFODNN7EXAMPLE",
          secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
          region: "eu-west-2",
          endPoint: process.env.SNS_HOST,
        };
      },
      inject: [],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersConverter, UsersRepository],
  exports: [TypeOrmModule, UsersService, UsersRepository, UsersConverter],
})
export class UsersModule {}
