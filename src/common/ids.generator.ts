import { v4 as uuid } from "uuid";

export class Ids {
  static genUuid(): string {
    return uuid();
  }

  /**
   * This is for IDs we generate plenty, but never use in tests' cleanup procedures.
   *
   * Having this method allows us to only spy on the above one, making tests' cleanup much faster.
   */
  static genSecondaryId(): string {
    return uuid();
  }
}
