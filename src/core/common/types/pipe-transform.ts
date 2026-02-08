import { ArgumentMetadata } from "./argument_metadata.js";

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetadata): R;
}
