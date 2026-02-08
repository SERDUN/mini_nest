import { CallHandler, NestInterceptor } from "../types/nest-interceptor.js";
import { Type } from "../types/type.js";
import { MODULE_INTERCEPTORS_KEY } from "../types/metadata.keys.js";
import { ExecutionContext } from "../types/execution-context.js";
import { ServiceLocator } from "./service-locator.js";

export class InterceptorsConsumer {
  constructor(private readonly serviceLocator: ServiceLocator) {}

  public async intercept(
    context: ExecutionContext,
    interceptors: (NestInterceptor | Type<NestInterceptor>)[],
    next: () => Promise<any> //controller handler
  ): Promise<any> {
    if (interceptors.length === 0) {
      return next();
    }

    const interceptorOrType = interceptors[0];
    const interceptorInstance = this.resolveInstance(interceptorOrType);

    const nextHandler: CallHandler = {
      handle: () => {
        return this.intercept(context, interceptors.slice(1), next);
      }
    };

    return interceptorInstance.intercept(context, nextHandler);
  }

  public getInterceptors(context: ExecutionContext, globalInterceptors: any[]): any[] {
    const controllerClass = context.getClass();
    const handler = context.getHandler();

    const classInterceptors = Reflect.getMetadata(MODULE_INTERCEPTORS_KEY, controllerClass) || [];
    const methodInterceptors = Reflect.getMetadata(MODULE_INTERCEPTORS_KEY, controllerClass.prototype, handler.name) || [];

    return [
      ...globalInterceptors,
      ...classInterceptors,
      ...methodInterceptors
    ];
  }

  private resolveInstance(interceptor: NestInterceptor | Type<NestInterceptor>): NestInterceptor {
    if (typeof interceptor === 'function') {
      try {
        return this.serviceLocator.resolve(interceptor);
      } catch (e) {
        return new (interceptor as any)();
      }
    }
    return interceptor;
  }
}
