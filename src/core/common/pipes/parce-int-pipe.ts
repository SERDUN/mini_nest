import { ArgumentMetadata } from "../types/argument_metadata.js";
import { PipeTransform } from "../types/pipe-transform.js";

export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {

    if (metadata.type === 'query') {
      console.log(`Processing query param: ${metadata.data}`);
    }

    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new Error('Validation failed (numeric string is expected)');
    }
    return val*2;
  }
}
