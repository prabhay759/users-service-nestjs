import { BadRequestException, Injectable } from "@nestjs/common";
import { DeepPartial, EntityManager } from "typeorm";
import { Transactional } from "../database/transactional";
import { UsersEntity } from "./model/users.entity";
import { UsersSearch } from "./api/users.interface";
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

  async patch(domain: DeepPartial<UsersEntity>, externalTransactionManager?: EntityManager): Promise<UsersEntity> {
    return await this.transactional.with(externalTransactionManager, async manager => {
      const usersRepo = manager.getRepository(UsersEntity);
      const existingEntity = await this.get(domain.id, manager);
      if (!existingEntity) {
        return;
      }
      domain.address.addressLine1 = domain.address.addressLine1 || existingEntity.address.addressLine1;
      domain.address.addressLine2 = domain.address.addressLine2 || existingEntity.address.addressLine2;
      domain.address.city = domain.address.city || existingEntity.address.city;
      domain.address.country = domain.address.country || existingEntity.address.country;
      domain.address.postCode = domain.address.postCode || existingEntity.address.postCode;
      domain.first_name = domain.first_name || existingEntity.first_name;
      domain.password = domain.password || existingEntity.password;
      domain.email = domain.email || existingEntity.email;
      await usersRepo.update(domain.id, domain);
      return await this.get(domain.id, manager);
    });
  }

  async put(domain: UsersEntity, externalTransactionManager?: EntityManager): Promise<UsersEntity> {
    return await this.transactional.with(externalTransactionManager, async manager => {
      const usersRepo = manager.getRepository(UsersEntity);

      const existingEntity = await this.get(domain.id, manager);
      if (!existingEntity) {
        return this.create(domain, manager);
      }
      await usersRepo.update(domain.id, domain);
    });
  }

  async search(search: UsersSearch, transactionEntityManager?: EntityManager): Promise<UsersEntity[]> {
    const q = this.transactional.connection(transactionEntityManager).createQueryBuilder();
    return q
      .select("users")
      .from(UsersEntity, "users")
      .where(this.searchQuery(search))
      .getMany();
  }

  searchQuery(search: UsersSearch): string {
    let result = "1=1";
    if (search.email) {
      result += ` and users.email='${search.email}'`;
    }
    if (search.first_name) {
      result += ` and users.first_name='${search.first_name}'`;
    }
    return result;
  }
}
