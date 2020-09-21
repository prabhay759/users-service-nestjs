import { EntityManager } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { SnsService } from "src/sns/sns.service";
import { Transactional } from "../database/transactional";
import { User, UsersAddress, UsersCreate, UsersReplace, UsersSearch, UsersUpdate } from "./api/users.interface";
import { UsersConverter } from "./users.converter";
import { UsersEntity } from "./model/users.entity";
import { UsersRepository } from "./users.repository";
import axios from "axios";

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

  async create(dto: UsersCreate, ip: string, transactionEntityManager?: EntityManager): Promise<User> {
    const address = await this.getAddress(ip);
    const usersEntity: UsersEntity = this.usersConverter.createToDomain({ ...dto }, address);
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

      // Notify SNS
      // await this.snsService.publish({
      //   Message: JSON.stringify(dto),
      //   TopicArn: process.env.SNS_TOPIC,
      // });

      return this.usersConverter.toDto(updated);
    });
  }

  async replace(
    userId: string,
    ip: string,
    dto: UsersReplace,
    transactionEntityManager?: EntityManager,
  ): Promise<void> {
    const address = await this.getAddress(ip);
    return this.transactional.with(transactionEntityManager, async manager => {
      const userEntity: UsersEntity = this.usersConverter.replaceToDomain(userId, dto, address);
      // Notify SNS
      // await this.snsService.publish({
      //   Message: JSON.stringify(userEntity),
      //   TopicArn: process.env.SNS_TOPIC,
      // });

      await this.usersRepository.put(userEntity, manager);
    });
  }

  async search(search: UsersSearch, transactionEntityManager?: EntityManager): Promise<User[]> {
    const entities = await this.usersRepository.search(search, transactionEntityManager);
    return entities.map(e => this.usersConverter.toDto(e));
  }

  async getAddress(ip: string): Promise<UsersAddress> {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`);
    if (res.data.country == "CH") {
      return this.usersConverter.toAddress(res.data);
    }

    throw new BadRequestException("Invalid IP address", JSON.stringify(res.data));
  }
}
