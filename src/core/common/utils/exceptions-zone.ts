import { ExceptionFilter,FILTER_CATCH_EXCEPTIONS,ExecutionContext,HttpException } from "../types/index.js";
import { Type } from "../types/type.js";
import { ServiceLocator } from "./service-locator.js";

export class ExceptionsZone {
  constructor(private readonly serviceLocator: ServiceLocator) {}

  public async handle(
    exception: any,
    context: ExecutionContext,
    scopedFilters: (ExceptionFilter | Type<ExceptionFilter>)[]
  ) {
    for (const filterOrType of scopedFilters) {
      const filter = this.resolveFilter(filterOrType);

      const caughtExceptions = Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, filter.constructor) || [];

      const isMatch =
        caughtExceptions.length === 0 ||
        caughtExceptions.some((exceptionType: any) => exception instanceof exceptionType);

      if (isMatch) {
        filter.catch(exception, context);
        return;
      }
    }

    this.defaultHandler(exception, context);
  }

  private defaultHandler(exception: any, context: ExecutionContext) {
    const res = context.getResponse();

    if (exception instanceof HttpException) {
      res.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.getResponse(),
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('Unhandled Exception:', exception);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error'
      });
    }
  }

  private resolveFilter(filterOrType: ExceptionFilter | Type<ExceptionFilter>): ExceptionFilter {
    if (typeof filterOrType === 'function') {
      try {
        return this.serviceLocator.resolve(filterOrType);
      } catch (e) {
        return new (filterOrType as any)();
      }
    }

    return filterOrType;
  }
}
