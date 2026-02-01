import "reflect-metadata";
import { MODULE_CONTROLLERS_REQUEST_ARGS } from "../types/metadata.keys.js";

export  enum ArgsType {
    QUERY = "query",
    BODY = "body",
    PARAM = "param",
}

export interface RouteParamMetadata {
  type: ArgsType;
  data?: string;
}

function args(target: Object, propertyKey: string | symbol, parameterIndex: number, paramName: string | undefined, argsType: ArgsType) {
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
      args(target, propertyKey, parameterIndex, paramName, ArgsType.QUERY);
    }
}

export function Body(paramName?: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      args(target, propertyKey, parameterIndex, paramName, ArgsType.BODY);
    }
}

export function Param(paramName?: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      args(target, propertyKey, parameterIndex, paramName, ArgsType.PARAM);
    }
}
