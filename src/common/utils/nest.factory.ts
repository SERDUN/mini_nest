import { ServiceLocator } from "./service-locator.js";
import { NestApplication } from "./nest.application.js";
import { MODULE_CONTROLLERS, MODULE_IMPORTS, MODULE_PROVIDERS } from "../types/metadata.keys.js";

export class NestFactory {
    static async create(rootModule: any): Promise<NestApplication> {
      const serviceLocator = new ServiceLocator();
      const accumulatedControllers: any[] = [];

      await this.bind(rootModule, serviceLocator,accumulatedControllers);
      console.log("Accumulated Controllers:", accumulatedControllers.map(c=>c.name));
      return new NestApplication(serviceLocator,accumulatedControllers);
    }

    static async bind(module: any,service:ServiceLocator,controllersAccumulator: any[]) {
      console.log("Accumulated controllers so far:", controllersAccumulator.map(c=>c.name));
      const providers = Reflect.getOwnMetadata(MODULE_PROVIDERS, module) || [];
      providers.forEach((provider: any) => {
        service.register(provider);
      })

      const controllers = Reflect.getOwnMetadata(MODULE_CONTROLLERS, module) || [];
      controllers.forEach((controller: any) => {
        service.register(controller);
        controllersAccumulator.push(controller);
      })

      const imports = Reflect.getOwnMetadata(MODULE_IMPORTS, module) || [];
      imports.forEach((imp: any) => {
        this.bind(imp,service,controllersAccumulator);
      })
    }
}
