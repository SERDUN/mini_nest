import { MODULE_FILTERS_KEY } from "../types/metadata.keys.js";
import { ExceptionFilter } from "../types/exception-filter.js";
import { Type } from "../types/type.js";

export function UseFilters(...filters: (ExceptionFilter | Type<ExceptionFilter>)[]) {
  return function (
    target: Object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(MODULE_FILTERS_KEY, filters, target, propertyKey);
    } else {
      Reflect.defineMetadata(MODULE_FILTERS_KEY, filters, target);
    }
  };
}
