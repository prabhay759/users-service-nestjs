import * as _ from "lodash";
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { ValidationTag } from "./types";

export class TaggedBadRequestException extends BadRequestException {
  readonly tags: ValidationTag[];

  constructor(response: Record<string, unknown>, description: string);
  constructor(messages: string[], description: string, ...tag: ValidationTag[]);
  constructor(message: string, ...tags: ValidationTag[]);
  constructor(
    messageOrObject: string | string[] | Record<string, unknown>,
    descriptionOrFirstTag: string | ValidationTag,
    ...tags: ValidationTag[]
  ) {
    super(
      {
        tags: [...tags],
        ...HttpException.createBody(
          messageOrObject,
          _.isString(messageOrObject) ? messageOrObject : descriptionOrFirstTag,
          HttpStatus.BAD_REQUEST,
        ),
      },
      typeof messageOrObject === "string" ? messageOrObject : descriptionOrFirstTag,
    );
    if (_.isObject(messageOrObject) && !_.isArray(messageOrObject)) {
      this.tags = _.uniq([...((messageOrObject["tags"] as ValidationTag[]) || []), ...tags]);
    } else if (_.isString(messageOrObject)) {
      this.tags = [ValidationTag[descriptionOrFirstTag], ...tags];
    } else {
      this.tags = [...tags];
    }
  }
}
