import "reflect-metadata";

import { InjectionToken } from "../../common/decorators/inject.decorator.js";

export const EXAMPLE_CONSTRUCTOR_METADATA_KEY = "EXAMPLE_CONSTRUCTOR_METADATA_KEY";

export function addConstructorMetadata(token: InjectionToken) {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingOptions = Reflect.getOwnMetadata(EXAMPLE_CONSTRUCTOR_METADATA_KEY,target);
    const key = propertyKey ? propertyKey.toString() : "constructor";
    const options = existingOptions ? { ...existingOptions } : {};

    options[key] = options[key] ? { ...options[key] } : {};
    options[key][parameterIndex] = token;


    Reflect.defineMetadata(EXAMPLE_CONSTRUCTOR_METADATA_KEY,options,target);
  }
}
