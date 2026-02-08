import { PipeTransform } from "../types/pipe-transform.js";
import { ArgumentMetadata } from "../types/argument_metadata.js";

export class ValidationPipe implements PipeTransform {
  private readonly scope: String;

  constructor(  scope: String) {
    this.scope = scope;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    console.log(`Validating ${metadata.type}, scope:`, this.scope);
    return value;
  }
}
