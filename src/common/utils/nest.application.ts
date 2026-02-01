import { ServiceLocator } from "./service-locator.js";
import express, { Express, Request, Response } from 'express';
import { MODULE_CONTROLLERS_PREFIX, MODULE_CONTROLLERS_REQUEST } from "../types/metadata.keys.js";
import { PathUtils } from "./path.utils.js";

export class NestApplication {
  private readonly app: Express;

  constructor(private readonly serviceLocator: ServiceLocator,private readonly controllers: any[]) {
    this.app = express();
    this.app.use(express.json());
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
    console.log(`Registering ${method} ${path}`);

    (this.app as any)[method](path, async (req: Request, res: Response) => {
      try {
        const result = await controller[handlerName](req, res);
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
