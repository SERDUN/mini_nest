import "reflect-metadata";
import { INJECTABLE, MODULE_CONTROLLERS_PREFIX } from "../types/metadata.keys.js";
import { Scope } from "../types/di.scope.js";

export function Controller(prefix: string) {
  return function (target: any) {
    Reflect.defineMetadata(MODULE_CONTROLLERS_PREFIX, prefix, target);

    Reflect.defineMetadata(INJECTABLE, {
      injectable: true,
      scope: Scope.DEFAULT
    }, target);
  }
}
