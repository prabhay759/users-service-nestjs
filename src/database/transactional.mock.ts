import { EntityManager } from "typeorm";
import { Transactional } from "./transactional";

export class TransactionalMock extends Transactional {
  constructor(public managerMock: EntityManager) {
    super(null);
  }

  async with<T>(
    transactionManager: EntityManager | undefined,
    action: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return await action(this.managerMock);
  }

  async withNew<T>(action: (manager: EntityManager) => Promise<T>): Promise<T> {
    return await action(this.managerMock);
  }

  connection(transactionManager?: EntityManager): EntityManager {
    return this.managerMock;
  }
}
