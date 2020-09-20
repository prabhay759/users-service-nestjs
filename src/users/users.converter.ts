import * as _ from "lodash";
import { Ids } from "../common/ids.generator";
import { Injectable } from "@nestjs/common";
import { User, UsersCreate } from "./api/users.interface";
import { UsersEntity } from "./model/users.entity";

@Injectable()
export class UsersConverter {
  toDto(entity: UsersEntity): User {
    return User.of({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      first_name: entity.first_name,
      addressLine1: entity.address.addressLine1,
      addressLine2: entity.address.addressLine2 || "",
      city: entity.address.city,
      country: entity.address.country,
      postCode: entity.address.postCode,
    });
  }

  createToDomain(dto: UsersCreate): UsersEntity {
    return UsersEntity.of({
      id: Ids.genUuid(),
      email: dto.email,
      first_name: dto.first_name,
      password: dto.password,
      address: {
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2 || "",
        city: dto.city,
        country: dto.country,
        postCode: dto.postCode,
      },
    });
  }
}
