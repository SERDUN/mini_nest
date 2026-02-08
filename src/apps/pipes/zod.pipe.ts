import { ArgumentMetadata, BadRequestException, PipeTransform } from "../../core/index.js";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform<any, any> {
  constructor(
    private readonly schema: ZodSchema
  ) {}

  transform(value: unknown, meta: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (err) {
      throw new BadRequestException(
        `Validation failed for ${meta.type}${meta.data ? ` (${meta.data})` : ''}`
      );
    }
  }
}
