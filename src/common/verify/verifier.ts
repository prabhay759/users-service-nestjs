import * as _ from "lodash";

export class Verifier {
  constructor(private inverse: boolean, private owner: Verifier, private thrower: (message: string) => void) {}

  get not(): Verifier {
    return new Verifier(!this.inverse, this, this.thrower);
  }

  throwing(exceptionClass: new (message: string) => any): Verifier {
    return new Verifier(this.inverse, this.owner, m => {
      throw new exceptionClass(m);
    });
  }

  defined(value: any, message?: string): Verifier {
    return this.runCheck(message || `${this.must} be defined`, () => !_.isNull(value) && !_.isUndefined(value));
  }

  truthy(value: any, message?: string): Verifier {
    return this.runCheck(message || `${this.must} be truthy`, () => !!value);
  }

  private runCheck(message: string, check: () => boolean): Verifier {
    const pass = !this.inverse === check();
    if (!pass) {
      this.thrower(message);
    }
    return this.owner || this;
  }

  private get must(): string {
    return this.inverse ? "must not" : "must";
  }
}

export const verify: Verifier = new Verifier(false, null, m => {
  throw Error(m);
});
