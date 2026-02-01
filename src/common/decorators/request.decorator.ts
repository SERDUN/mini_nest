import "reflect-metadata";
import { MODULE_CONTROLLERS_REQUEST } from "../types/metadata.keys.js";

interface RouteDefinition {
  path: string;
  requestMethod: 'get' | 'post' | 'put' | 'delete';
  methodName: string;
}

function _request(target: Object, propertyKey: string | symbol, route: RouteDefinition) {
  const existingDefinitions = Reflect.getOwnMetadata(MODULE_CONTROLLERS_REQUEST, target);
  const definitions = existingDefinitions ? {...existingDefinitions} : {};
  definitions[propertyKey.toString()] = route;
  Reflect.defineMetadata(MODULE_CONTROLLERS_REQUEST, definitions, target);
}

export function Get(path:string) {
    return function (target: Object, propertyKey: string | symbol) {
        _request(target, propertyKey, {path, requestMethod: 'get', methodName: propertyKey.toString()});
    }
}

export function Post(path:string) {
    return function (target: Object, propertyKey: string | symbol) {
        _request(target, propertyKey, {path, requestMethod: 'post', methodName: propertyKey.toString()});
    }
}

export function Put(path:string) {
    return function (target: Object, propertyKey: string | symbol) {
        _request(target, propertyKey, {path, requestMethod: 'put', methodName: propertyKey.toString()});
    }
}

export function Delete(path:string) {
    return function (target: Object, propertyKey: string | symbol) {
        _request(target, propertyKey, {path, requestMethod: 'delete', methodName: propertyKey.toString()});
    }
}
