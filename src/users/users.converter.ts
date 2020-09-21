import * as _ from "lodash";
import { Ids } from "../common/ids.generator";
import { Injectable } from "@nestjs/common";
import { User, UsersAddress, UsersCreate, UsersUpdate } from "./api/users.interface";
import { UsersEntity } from "./model/users.entity";

@Injectable()
export class UsersConverter {
  toDto(entity: UsersEntity): User {
    return User.of({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      first_name: entity.first_name,
      region: entity.address.region,
      city: entity.address.city,
      country: entity.address.country,
      postal: entity.address.postal,
    });
  }

  createToDomain(dto: UsersCreate, address: UsersAddress): UsersEntity {
    return UsersEntity.of({
      id: Ids.genUuid(),
      email: dto.email,
      first_name: dto.first_name,
      password: dto.password,
      address: {
        region: address.region,
        city: address.city,
        country: address.country,
        postal: address.postal,
      },
    });
  }

  updateToDomain(userId: string, dto: UsersUpdate): UsersEntity {
    return UsersEntity.of({
      id: userId,
      email: dto.email || "",
      first_name: dto.first_name || "",
      password: dto.password || "",
    });
  }

  replaceToDomain(userId: string, dto: UsersUpdate, address: UsersAddress): UsersEntity {
    return UsersEntity.of({
      id: userId,
      email: dto.email,
      first_name: dto.first_name,
      password: dto.password,
      address: {
        region: address.region,
        city: address.city,
        country: address.country,
        postal: address.postal,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toAddress(address: any): UsersAddress {
    const userAddress = new UsersAddress();
    userAddress.city = address.city;
    userAddress.region = address.region;
    userAddress.postal = address.postal;
    userAddress.country = address.country_name;

    return userAddress;
  }
}
