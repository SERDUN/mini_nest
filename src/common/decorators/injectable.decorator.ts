import "reflect-metadata";

import { INJECTABLE } from "../types/metadata.keys.js";
import { Scope } from "../types/di.scope.js";

export interface InjectableOptions {
  scope?: Scope;
}

export interface InjectableMetadata {
  injectable: boolean;
  scope: Scope;
}

export function Injectable(options:InjectableOptions={}) {
  return function (target:any){
  const metadata: InjectableMetadata = {
        injectable: true,
        scope: options?.scope?? Scope.DEFAULT,
      };
    Reflect.defineMetadata(INJECTABLE,metadata,target);
  };
}
