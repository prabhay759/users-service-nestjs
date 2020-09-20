import { BadRequestException, Injectable } from "@nestjs/common";
import { DeepPartial, EntityManager, SelectQueryBuilder } from "typeorm";
import { User, UsersCreate, UsersUpdate } from "./api/users.interface";
import { UsersEntity } from "./model/users.entity";
// import { ResourceSearchDescriptor } from "./search/resource-search.descriptor";
// import { SearchTerm } from "../common/search/search.interface";
import { Transactional } from "../database/transactional";
import { verify } from "../common/verify/verifier";
import { withExceptionsTranslated } from "../common/database/orm-exception-translator.utils";

@Injectable()
export class UsersRepository {
  constructor(private transactional: Transactional) {}

  async get(id: string, externalTransactionManager?: EntityManager): Promise<UsersEntity | undefined> {
    verify.truthy(id, `User ID must be provided`);
    return await this.transactional
      .connection(externalTransactionManager)
      .getRepository(UsersEntity)
      .findOne(id);
  }

  async create(domain: UsersEntity, externalTransactionManager?: EntityManager): Promise<UsersEntity> {
    return await this.transactional.with(externalTransactionManager, async manager => {
      const resourceRepo = manager.getRepository(UsersEntity);

      const existingEntity = await this.get(domain.id, manager);
      if (existingEntity) throw new BadRequestException(`User already exists`);
      return await withExceptionsTranslated(async () => await resourceRepo.save(domain));
    });
  }

  async delete(id: string, externalTransactionManager?: EntityManager): Promise<boolean> {
    verify.truthy(id, `User ID must be provided`);
    const { affected } = await this.transactional
      .connection(externalTransactionManager)
      .getRepository(UsersEntity)
      .delete(id);
    return affected === 1;
  }
}
