import "reflect-metadata";
import { MODULE_CONTROLLERS_REQUEST_ARGS } from "../types/metadata.keys.js";
import { Paramtype } from "../types/paramtype.js";


export interface RouteParamMetadata {
  type: Paramtype;
  data?: string;
}

function args(target: Object, propertyKey: string | symbol, parameterIndex: number, paramName: string | undefined, argsType: Paramtype) {
 const routeParam: RouteParamMetadata = {
    type: argsType,
    data: paramName,
  };

  const existingMetadata = Reflect.getOwnMetadata(MODULE_CONTROLLERS_REQUEST_ARGS, target);
  const metadata = existingMetadata ? {...existingMetadata} : {};

  metadata[propertyKey] = metadata[propertyKey] ? {...metadata[propertyKey]} : {};
  metadata[propertyKey][parameterIndex] = routeParam;

  Reflect.defineMetadata(MODULE_CONTROLLERS_REQUEST_ARGS, metadata, target);
}


export function Query(paramName?: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      args(target, propertyKey, parameterIndex, paramName, Paramtype.QUERY);
    }
}

export function Body(paramName?: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      args(target, propertyKey, parameterIndex, paramName, Paramtype.BODY);
    }
}

export function Param(paramName?: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      args(target, propertyKey, parameterIndex, paramName, Paramtype.PARAM);
    }
}
