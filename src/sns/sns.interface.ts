import { ConfigurationOptions } from "aws-sdk/lib/config";
import { ModuleMetadata } from "@nestjs/common/interfaces";
/**
 *  @export
 * @interface ISNSModuleAsyncOptions
 * @extends {Pick<ModuleMetadata, 'imports'>}
 */
export interface ISNSModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => Promise<ConfigurationOptions> | ConfigurationOptions;
  inject?: any[];
}
