import "reflect-metadata";
import { MODULE_CONTROLLERS_REQUEST_ARGS } from "../types/metadata.keys.js";
import { ArgsType } from "../types/args-type.js";
import { PipeTransform } from "../types/pipe-transform.js";
import { Type } from "../types/type.js";

export interface RouteParamMetadata {
  type: ArgsType;
  data?: string;
  pipes: (PipeTransform | Type<PipeTransform>)[];
}

function args(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
  paramName: string | undefined,
  argsType: ArgsType,
  pipes: (PipeTransform | Type<PipeTransform>)[]
) {
  const routeParam: RouteParamMetadata = {
    type: argsType,
    data: paramName,
    pipes: pipes,
  };

  const existingMetadata = Reflect.getOwnMetadata(MODULE_CONTROLLERS_REQUEST_ARGS, target);
  const metadata = existingMetadata ? {...existingMetadata} : {};

  metadata[propertyKey] = metadata[propertyKey] ? {...metadata[propertyKey]} : {};
  metadata[propertyKey][parameterIndex] = routeParam;

  Reflect.defineMetadata(MODULE_CONTROLLERS_REQUEST_ARGS, metadata, target);
}

export function Query(paramName?: string, ...pipes: (PipeTransform | Type<PipeTransform>)[]) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    args(target, propertyKey, parameterIndex, paramName, ArgsType.QUERY, pipes);
  }
}

export function Body(paramName?: string, ...pipes: (PipeTransform | Type<PipeTransform>)[]) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    args(target, propertyKey, parameterIndex, paramName, ArgsType.BODY, pipes);
  }
}

export function Param(paramName?: string, ...pipes: (PipeTransform | Type<PipeTransform>)[]) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    args(target, propertyKey, parameterIndex, paramName, ArgsType.PARAM, pipes);
  }
}
