import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../database/database.module";
import { Module } from "@nestjs/common";
import { SnsModule } from "src/sns/sns.module";
import { SnsService } from "src/sns/sns.service";
import { Transactional } from "src/database/transactional";
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
          accessKeyId: "",
          secretAccessKey: "",
          region: "eu-west-2",
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
