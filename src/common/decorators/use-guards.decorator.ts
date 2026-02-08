import { MODULE_GUARDS_KEY } from "../types/metadata.keys.js";
import { Type } from "../types/type.js";
import { CanActivate } from "../types/can_activate.js";

export function UseGuards(...guards: (CanActivate | Type<CanActivate>)[]) {
  return function (
    target: Object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(MODULE_GUARDS_KEY, guards, target, propertyKey);
    } else {
      Reflect.defineMetadata(MODULE_GUARDS_KEY, guards, target);
    }
  };
}
