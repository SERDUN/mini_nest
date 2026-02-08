import { MODULE_PIPES_KEY } from "../types/metadata.keys.js";
import { PipeTransform } from "../types/pipe-transform.js";
import { Type } from "../types/type.js";

export function UsePipes(...pipes: (PipeTransform | Type<PipeTransform>)[]) {
  return function (
    target: Object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(MODULE_PIPES_KEY, pipes, target, propertyKey);
    } else {
      Reflect.defineMetadata(MODULE_PIPES_KEY, pipes, target);
    }
  };
}
