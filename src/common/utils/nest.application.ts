import { ServiceLocator } from "./service-locator.js";
import express, { Express, NextFunction, Request, Response } from 'express';
import { DESIGN_PARAMTYPES, MODULE_CONTROLLERS_PREFIX, MODULE_CONTROLLERS_REQUEST, MODULE_CONTROLLERS_REQUEST_ARGS } from "../types/metadata.keys.js";
import { PathUtils } from "./path.utils.js";
import { RouteArgsFactory } from "./argument_resolver.js";
import { ArgumentMetadata } from "../types/argument_metadata.js";
import { PipeTransform } from "../types/pipe-transform.js";

export class NestApplication {
  private readonly app: Express;
  private readonly routeArgsFactory: RouteArgsFactory;

  constructor(private readonly serviceLocator: ServiceLocator,private readonly controllers: any[]) {
    this.app = express();
    this.app.use(express.json());
    this.routeArgsFactory = new RouteArgsFactory();
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

      console.log(
        `Setting up routes for controller: ${ControllerClass.name} with prefix: '${prefix}' and routes:`, routes
      )

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
      try {
        const args = await this.resolveMethodArgs(controller, methodName, req, res);

        const result = await (controller as any)[methodName](...args);

        this.handleResponse(res, result);
      } catch (error) {
        this.handleError(res, error, req.method, req.path);
      }
    };
  }

  private async resolveMethodArgs(controller: any, methodName: string, req: Request, res: Response): Promise<any[]> {
    const controllerPrototype = Object.getPrototypeOf(controller);

    const allControllersArgs = Reflect.getOwnMetadata(MODULE_CONTROLLERS_REQUEST_ARGS, controllerPrototype) || {};
    const methodArgs = allControllersArgs[methodName] || {};
    const paramTypes = Reflect.getMetadata(DESIGN_PARAMTYPES, controllerPrototype, methodName) || [];

    const args: any[] = [];
    const sortedKeys = Object.keys(methodArgs).map(Number).sort((a, b) => a - b);

    for (const index of sortedKeys) {
      const paramMetadata = methodArgs[index];
      const resolver = this.routeArgsFactory.getResolver(paramMetadata.type);

      if (!resolver) {
        args[index] = undefined;
        continue;
      }

      let value = resolver.resolve(req, res, paramMetadata);

      value = await this.applyPipes(value, paramMetadata, paramTypes[index]);

      args[index] = value;
    }

    return args;
  }

  private async applyPipes(value: any, paramMetadata: any, metatype: any): Promise<any> {
    const pipes = paramMetadata.pipes || [];

    for (const pipeOrClass of pipes) {
      const pipeInstance = this.resolvePipeInstance(pipeOrClass);

      const metadata: ArgumentMetadata = {
        type: paramMetadata.type,
        metatype: metatype,
        data: paramMetadata.data
      };

      value = await pipeInstance.transform(value, metadata);
    }
    return value;
  }

  private resolvePipeInstance(pipeOrClass: PipeTransform | (new () => PipeTransform)): PipeTransform {
    if (typeof pipeOrClass === 'function') {
      return new (pipeOrClass as any)(); // use service locator if needed for more complex pipes
    }
    return pipeOrClass;
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
