import { ServiceLocator } from "./service-locator.js";
import { NestApplication } from "./nest.application.js";
import { MODULE_CONTROLLERS, MODULE_IMPORTS, MODULE_PROVIDERS } from "../types/metadata.keys.js";

export class NestFactory {
    static async create(rootModule: any): Promise<NestApplication> {
      const serviceLocator = new ServiceLocator();

      await this.bind(rootModule, serviceLocator)

      return new NestApplication(serviceLocator);
    }

    static async bind(module: any,service:ServiceLocator) {
      const providers = Reflect.getOwnMetadata(MODULE_PROVIDERS, module) || [];
      providers.forEach((provider: any) => {
        service.register(provider);
      })

      const controllers = Reflect.getOwnMetadata(MODULE_CONTROLLERS, module) || [];
      controllers.forEach((controller: any) => {
        service.register(controller);
      })

      const imports = Reflect.getOwnMetadata(MODULE_IMPORTS, module) || [];
      imports.forEach((imp: any) => {
        this.bind(imp,service);
      })
    }
}
