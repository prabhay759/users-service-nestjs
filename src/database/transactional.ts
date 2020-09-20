import { Connection, EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Transactional {
  constructor(private conn: Connection) {}

  async withNew<T>(action: (manager: EntityManager) => Promise<T>): Promise<T> {
    return await this.with(undefined, action);
  }

  async with<T>(
    transactionManager: EntityManager | undefined,
    action: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    if (transactionManager) {
      return await action(transactionManager);
    } else {
      return await this.conn.transaction(action);
    }
  }

  connection(transactionManager?: EntityManager): EntityManager {
    return transactionManager || this.conn.manager;
  }
}
