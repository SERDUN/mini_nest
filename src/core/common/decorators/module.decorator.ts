import "reflect-metadata";

import { MODULE_CONTROLLERS, MODULE_IMPORTS, MODULE_PROVIDERS } from "../types/metadata.keys.js";

export interface ModuleMetadata {
  imports?:  Array<any>;
  controllers?: Array<any>;
  providers?: Array<any>;
  exports?: Array<any>;
}

export function Module(metadata: ModuleMetadata) {
  return function (target: any) {
    Reflect.defineMetadata(MODULE_IMPORTS, metadata.imports || [], target);
    Reflect.defineMetadata(MODULE_PROVIDERS, metadata.providers || [], target);
    Reflect.defineMetadata(MODULE_CONTROLLERS, metadata.controllers || [], target);
  }
}
