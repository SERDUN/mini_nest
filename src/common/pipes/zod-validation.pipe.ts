import { PipeTransform } from "../types/pipe-transform.js";
import { ArgumentMetadata } from "../types/argument_metadata.js";
import { ZodSchema } from "zod";
import { BadRequestException } from "../types/http-exception.js";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  public transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');

      throw new BadRequestException(errorMessage);
    }

    return result.data;
  }
}
