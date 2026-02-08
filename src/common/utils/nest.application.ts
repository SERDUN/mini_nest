import { ServiceLocator } from "./service-locator.js";
import express, { Express, NextFunction, Request, Response } from 'express';
import { DESIGN_PARAMTYPES, MODULE_CONTROLLERS_PREFIX, MODULE_CONTROLLERS_REQUEST, MODULE_CONTROLLERS_REQUEST_ARGS } from "../types/metadata.keys.js";
import { PathUtils } from "./path.utils.js";
import { RouteArgsFactory } from "./argument_resolver.js";

import { ExecutionContext, NestExecutionContext } from "../types/execution-context.js";
import { ParamsProcessor } from "./params_processor.js";

export class NestApplication {
  private readonly app: Express;
  private readonly routeArgsFactory: RouteArgsFactory;
  private readonly paramsProcessor: ParamsProcessor;

  constructor(private readonly serviceLocator: ServiceLocator, private readonly controllers: any[]) {
    this.app = express();
    this.app.use(express.json());
    this.routeArgsFactory = new RouteArgsFactory();
    this.paramsProcessor = new ParamsProcessor(this.routeArgsFactory);
    this.initRoutes();
  }

  public get<T>(token: any): T {
    return this.serviceLocator.resolve<T>(token);
  }

  public async listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }

  private initRoutes() {
    console.log("Init routes: controllers count =", this.controllers.length);

    this.controllers.forEach(ControllerClass => {
      const controllerInstance = this.serviceLocator.resolve(ControllerClass);
      const prefix = Reflect.getMetadata(MODULE_CONTROLLERS_PREFIX, ControllerClass) || '';
      const routes = Reflect.getMetadata(MODULE_CONTROLLERS_REQUEST, ControllerClass.prototype) || {};

      Object.values(routes).forEach((route: any) => {
        const { path, requestMethod, methodName } = route;
        const fullPath = PathUtils.join(prefix, path);

        console.log(`Mapped {${fullPath}, ${requestMethod.toUpperCase()}} to ${ControllerClass.name}.${methodName}`);

        this.registerRoute(requestMethod, fullPath, controllerInstance, methodName);
      });
    });
  }

  private registerRoute(method: string, path: string, controller: any, handlerName: string) {
    const handler = this.createRouteHandler(controller, handlerName);
    (this.app as any)[method](path, handler);
  }

  private createRouteHandler(controller: any, methodName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const context = new NestExecutionContext(
        controller.constructor,
        controller[methodName],
        req,
        res,
        next
      );

      try {
        const args = await this.resolveMethodArgs(context, controller, methodName);
        const result = await (controller as any)[methodName](...args);
        this.handleResponse(res, result);
      } catch (error) {
        this.handleError(res, error, req.method, req.path);
      }
    };
  }

  private async resolveMethodArgs(context: ExecutionContext, controller: any, methodName: string): Promise<any[]> {
    const controllerPrototype = Object.getPrototypeOf(controller);

    const allControllersArgs = Reflect.getOwnMetadata(MODULE_CONTROLLERS_REQUEST_ARGS, controllerPrototype) || {};
    const methodArgs = allControllersArgs[methodName] || {};
    const paramTypes = Reflect.getMetadata(DESIGN_PARAMTYPES, controllerPrototype, methodName) || [];

    const args: any[] = [];
    const sortedKeys = Object.keys(methodArgs).map(Number).sort((a, b) => a - b);

    for (const index of sortedKeys) {
      const paramMetadata = methodArgs[index];

      args[index] = await this.paramsProcessor.resolve(
        context,
        paramMetadata,
        paramTypes[index]
      );
    }

    return args;
  }

  private handleResponse(res: Response, result: any) {
    if (result !== undefined && !res.headersSent) {
      res.json(result);
    }
  }

  private handleError(res: Response, error: any, method: string, path: string) {
    console.error(`Error processing request ${method} ${path}:`, error);

    if (!res.headersSent) {
      res.status(400).json({
        statusCode: 400,
        message: error.message || "Bad Request",
        error: "Bad Request"
      });
    }
  }
}
