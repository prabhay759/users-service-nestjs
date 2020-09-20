import { Ids } from "./ids.generator";
import Mock = jest.Mock;

export function spyIds(): void {
  jest.spyOn(Ids, "genUuid");
}

export function allSpiedIds(): string[] {
  return (Ids.genUuid as Mock).mock.results
    .filter(({ type }) => type === "return")
    .map(({ value }) => value);
}

export function producedId(index: number): any {
  return (Ids.genUuid as Mock).mock.results[index].value;
}
