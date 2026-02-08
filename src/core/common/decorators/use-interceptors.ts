import { NestInterceptor } from "../types/nest-interceptor.js";
import { Type } from "../types/type.js";
import { MODULE_INTERCEPTORS_KEY } from "../types/metadata.keys.js";

export function UseInterceptors(...interceptors: (NestInterceptor | Type<NestInterceptor>)[]) {
  return function (
    target: Object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(MODULE_INTERCEPTORS_KEY, interceptors, target, propertyKey);
    } else {
      Reflect.defineMetadata(MODULE_INTERCEPTORS_KEY, interceptors, target);
    }
  };
}
