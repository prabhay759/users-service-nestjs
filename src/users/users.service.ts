import { EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SnsService } from "src/sns/sns.service";
import { Transactional } from "../database/transactional";
import { User, UsersCreate, UsersReplace, UsersSearch, UsersUpdate } from "./api/users.interface";
import { UsersConverter } from "./users.converter";
import { UsersEntity } from "./model/users.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersConverter: UsersConverter,
    private snsService: SnsService,
    private transactional: Transactional,
  ) {}

  async get(id: string, transactionEntityManager?: EntityManager): Promise<User | undefined> {
    const user = await this.usersRepository.get(id, transactionEntityManager);
    return this.usersConverter.toDto(user);
  }

  async create(dto: UsersCreate, transactionEntityManager?: EntityManager): Promise<User> {
    const usersEntity: UsersEntity = this.usersConverter.createToDomain({ ...dto });
    return this.transactional.with(transactionEntityManager, async manager => {
      const user = await this.usersRepository.create(usersEntity, manager);
      return this.usersConverter.toDto(user);
    });
  }

  async remove(id: string, transactionEntityManager?: EntityManager): Promise<boolean> {
    return await this.usersRepository.delete(id, transactionEntityManager);
  }

  async update(userId: string, dto: UsersUpdate, transactionEntityManager?: EntityManager): Promise<User> {
    return this.transactional.with(transactionEntityManager, async manager => {
      const userEntity: UsersEntity = this.usersConverter.updateToDomain(userId, dto);
      const updated = await this.usersRepository.patch(userEntity, manager);
      if (!updated) {
        return;
      }
      return this.usersConverter.toDto(updated);
    });
  }

  async replace(userId: string, dto: UsersReplace, transactionEntityManager?: EntityManager): Promise<void> {
    return this.transactional.with(transactionEntityManager, async manager => {
      const userEntity: UsersEntity = this.usersConverter.replaceToDomain(userId, dto);
      await this.usersRepository.put(userEntity, manager);
    });
  }

  async search(search: UsersSearch, transactionEntityManager?: EntityManager): Promise<User[]> {
    const entities = await this.usersRepository.search(search, transactionEntityManager);
    return entities.map(e => this.usersConverter.toDto(e));
  }
}
