import { BadRequestException } from "@nestjs/common";
import { verify } from "./verifier";

describe("verifier", () => {
  it("not and throwing", () => {
    verify.defined("test");
    expect(() => verify.defined(null)).toThrowError("must be defined");

    verify.not.defined(null);
    expect(() => verify.not.defined("")).toThrowError("must not be defined");

    expect(() => verify.throwing(BadRequestException).defined(null)).toThrowWithMessage(
      BadRequestException,
      "must be defined",
    );
    expect(() =>
      verify
        .throwing(BadRequestException)
        .defined("test")
        .defined(null),
    ).toThrowWithMessage(BadRequestException, "must be defined");
    expect(() => verify.throwing(BadRequestException).not.defined("test")).toThrowWithMessage(
      BadRequestException,
      "must not be defined",
    );
    expect(() =>
      verify
        .throwing(BadRequestException)
        .not.defined(null)
        .not.defined("test"),
    ).toThrowWithMessage(BadRequestException, "must not be defined");
  });
  it("defined", () => {
    verify.defined("test");
    verify.defined("");
    verify.defined(10);
    verify.defined(0);
    verify.defined(false);
    verify.defined({ hello: "test" });
    verify.defined({});
    verify.defined([1, 2, 3]);
    verify.defined([]);
    verify.not.defined(null);
    verify.not.defined(undefined);
    expect(() => verify.defined(null)).toThrowError("must be defined");
    expect(() => verify.not.defined(10)).toThrowError("must not be defined");
  });
  it("truthy", () => {
    verify.truthy("test");
    verify.not.truthy("");
    verify.truthy(10);
    verify.not.truthy(0);
    verify.truthy(true);
    verify.not.truthy(false);
    verify.truthy({ hello: "test" });
    verify.truthy({});
    verify.truthy([1, 2, 3]);
    verify.truthy([]);
    verify.not.truthy(null);
    verify.not.truthy(undefined);
    expect(() => verify.truthy("")).toThrowError("must be truthy");
    expect(() => verify.not.truthy(true)).toThrowError("must not be truthy");
  });
});
