import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PublishInput, PublishResponse } from "aws-sdk/clients/sns";
import { SNS } from "aws-sdk";

import { AwsConfigurationOptions } from "./sns.interface";
import { CONFIG_CONNECTION_OPTIONS } from "./sns.constant";

/**
 * @export
 * @class AwsSnsService
 */
@Injectable()
export class SnsService {
  private readonly _sns: SNS;
  constructor(@Inject(CONFIG_CONNECTION_OPTIONS) private _options: AwsConfigurationOptions) {
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
            data: info,
          },
        ];
      })
      .catch(err => {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            data: err,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
