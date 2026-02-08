import { Catch } from "../common/decorators/catch.decorator.js";
import { HttpException } from "../common/types/http-exception.js";
import { ExceptionFilter } from "../common/types/exception-filter.js";
import { ExecutionContext } from "../common/types/execution-context.js";
import { Injectable } from "../common/decorators/injectable.decorator.js";

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, context: ExecutionContext) {
    const ctx = context;
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    console.log(`Filter caught error: ${request.url}`);

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.getResponse(),
        custom: "This is a custom error response from HttpExceptionFilter"
      });
  }
}
