import { ConfigurationOptions } from "aws-sdk/lib/config";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PublishInput, PublishResponse } from "aws-sdk/clients/sns";
import { SNS } from "aws-sdk";

import { CONFIG_CONNECTION_OPTIONS } from "./sns.constant";

/**
 * @export
 * @class AwsSnsService
 */
@Injectable()
export class AwsSnsService {
  private readonly _sns: SNS;
  constructor(@Inject(CONFIG_CONNECTION_OPTIONS) private _options: ConfigurationOptions) {
    this._sns = new SNS(this._options);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sendToQueue(options: PublishInput) {
    return this._sns
      .publish(options)
      .promise()
      .then((info: PublishResponse) => {
        return [
          {
            statusCode: HttpStatus.OK,
            message: "Sms sent",
            data: info,
          },
        ];
      })
      .catch(err => {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Failed to send",
            data: err,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
