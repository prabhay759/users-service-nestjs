import { EntityManager } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { SnsService } from "src/sns/sns.service";
import { Transactional } from "../database/transactional";
import { User, UsersCreate, UsersUpdate } from "./api/users.interface";
import { UsersConverter } from "./users.converter";
import { UsersEntity } from "./model/users.entity";
import { UsersRepository } from "./users.repository";
import { verify } from "../common/verify/verifier";

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
}
