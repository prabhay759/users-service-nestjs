import { ModuleMetadata } from "@nestjs/common/interfaces";

/**
 *  @export
 * @interface ISNSModuleAsyncOptions
 * @extends {Pick<ModuleMetadata, 'imports'>}
 */
export interface ISNSModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => Promise<AwsConfigurationOptions> | AwsConfigurationOptions;
  inject?: any[];
}

export class AwsConfigurationOptions {
  accessKeyId?: string;
  secretAccessKey?: string;
  maxRetries?: number;
  region?: string;
}
