import { DynamicModule, Module } from "@nestjs/common";

import { CONFIG_CONNECTION_OPTIONS } from "./sns.constant";
import { ISNSModuleAsyncOptions } from "./sns.interface";
import { SnsService } from "./sns.service";

/**
 * @export
 * @class SnsModule
 */
@Module({})
export class SnsModule {
  static forRootSnsAsync(options: ISNSModuleAsyncOptions): DynamicModule {
    return {
      module: SnsModule,
      providers: [
        {
          provide: CONFIG_CONNECTION_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        SnsService,
      ],
      exports: [SnsService],
    };
  }
}
