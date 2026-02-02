import { ServiceLocator } from "./service-locator.js";
import express, { Express, Request, Response } from 'express';
import { MODULE_CONTROLLERS_PREFIX, MODULE_CONTROLLERS_REQUEST, MODULE_CONTROLLERS_REQUEST_ARGS } from "../types/metadata.keys.js";
import { PathUtils } from "./path.utils.js";
import { RouteArgsFactory } from "./argument_resolver.js";

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
    (this.app as any)[method](path, async (req: Request, res: Response) => {
      try {
        console.log(`Registering ${method} ${path} controller: ${controller.constructor.name}, handler: ${handlerName}`);
        const allControllersArgs = Reflect.getOwnMetadata(
          MODULE_CONTROLLERS_REQUEST_ARGS,
          Object.getPrototypeOf(controller)
        );

        console.log("Method:", handlerName);
        console.log("allControllersArgs:", allControllersArgs);

        const methodArgs = allControllersArgs[handlerName] || {};

        console.log(`methodArgs: `, methodArgs);
        const args: any[] = [];

        Object.keys(methodArgs).forEach((indexKey) => {
          const index = Number(indexKey);
          const paramMetadata = methodArgs[indexKey];

          const resolver = this.routeArgsFactory.getResolver(paramMetadata.type);

          if (resolver) {
            args[index] = resolver.resolve(req, res, paramMetadata);
          } else {
            console.warn(`No resolver found for argument type: ${paramMetadata.type}`);
            args[index] = undefined;
          }
        });

        const result = await (controller as any)[handlerName](...args);
        console.log(`Registered ${method} ${path}: result =`, result);

        if (result !== undefined && !res.headersSent) {
          res.json(result);
        }

      } catch (error: any) {
        console.error(`Error in ${path}:`, error);
        res.status(500).json({
          statusCode: 500,
          message: "Internal Server Error",
          error: error.message
        });
      }
    });
  }
}
