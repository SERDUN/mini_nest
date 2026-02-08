import { FILTER_CATCH_EXCEPTIONS } from "../types/metadata.keys.js";
import { Type } from "../types/type.js";

export function Catch(...exceptions: Type<any>[]) {
  return (target: object) => {
    Reflect.defineMetadata(FILTER_CATCH_EXCEPTIONS, exceptions, target);
  };
}
