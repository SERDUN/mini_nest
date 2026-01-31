import { ServiceLocator } from "./service-locator.js";
import { NestApplication } from "./nest.application.js";
import { MODULE_CONTROLLERS, MODULE_IMPORTS, MODULE_PROVIDERS } from "../types/metadata.keys.js";

export class NestFactory {
    static async create(rootModule: any): Promise<NestApplication> {
      const serviceLocator = new ServiceLocator();

      const imports = Reflect.getOwnMetadata(MODULE_IMPORTS, rootModule) || [];
      const providers = Reflect.getOwnMetadata(MODULE_PROVIDERS, rootModule) || [];
      const controllers = Reflect.getOwnMetadata(MODULE_CONTROLLERS, rootModule) || [];

      providers.forEach((provider: any) => {
        serviceLocator.register(provider);
      })

      return new NestApplication(serviceLocator);
    }
}
