import "reflect-metadata";

import { INJECT } from "../types/metadata.keys.js";

export type InjectionToken = symbol

export function Inject(token:InjectionToken) {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number){
    const existingOptions = Reflect.getOwnMetadata(INJECT, target);

    const options = existingOptions ? { ...existingOptions } : {};
    const key = propertyKey ? propertyKey.toString() : "constructor";

    options[key] = options[key] ? { ...options[key] } : {};
    options[key][parameterIndex] = token;

    Reflect.defineMetadata(INJECT,options,target);
  };
}
