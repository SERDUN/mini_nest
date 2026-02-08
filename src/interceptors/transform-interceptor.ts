import { CallHandler, NestInterceptor } from "../common/types/nest-interceptor.js";
import { ExecutionContext } from "../common/types/execution-context.js";
import { Injectable } from "../common/decorators/injectable.decorator.js";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    console.log('Before...');
    const result = await next.handle();
    console.log('After...');

    return {
      data: result,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };
  }
}
