import { Request, Response, NextFunction } from 'express';

export interface ExecutionContext {
  getClass<T = any>(): new (...args: any[]) => T;
  getHandler(): Function;
  getRequest<T = any>(): T;
  getResponse<T = any>(): T;
  getNext<T = any>(): T;
}

export class NestExecutionContext implements ExecutionContext {
  constructor(
    private readonly controllerClass: new (...args: any[]) => any,
    private readonly handler: Function,
    private readonly req: Request,
    private readonly res: Response,
    private readonly next: NextFunction
  ) {}

  getClass<T = any>(): new (...args: any[]) => T {
    return this.controllerClass;
  }

  getHandler(): Function {
    return this.handler;
  }

  getRequest<T = Request>(): T {
    return this.req as T;
  }

  getResponse<T = Response>(): T {
    return this.res as T;
  }

  getNext<T = NextFunction>(): T {
    return this.next as T;
  }
}
