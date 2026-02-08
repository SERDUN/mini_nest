import { ServiceLocator } from "./service-locator.js";
import { NestApplication } from "./nest.application.js";
import { MODULE_CONTROLLERS, MODULE_IMPORTS, MODULE_PROVIDERS } from "../types/metadata.keys.js";

export class NestFactory {
  static async create(rootModule: any): Promise<NestApplication> {
    const serviceLocator = new ServiceLocator();
    const accumulatedControllers: any[] = [];
    const scannedModules = new Set<any>();

    await this.scanModule(rootModule, serviceLocator, accumulatedControllers, scannedModules);
    return new NestApplication(serviceLocator, accumulatedControllers);
  }

  private static async scanModule(
    module: any,
    service: ServiceLocator,
    controllersAccumulator: any[],
    scannedModules: Set<any>
  ) {
    if (scannedModules.has(module)) {
      return;
    }
    scannedModules.add(module);

    console.log(`Scanning module: ${module.name}`);

    const providers = Reflect.getOwnMetadata(MODULE_PROVIDERS, module) || [];
    providers.forEach((provider: any) => {
      service.register(provider);
    });

    const controllers = Reflect.getOwnMetadata(MODULE_CONTROLLERS, module) || [];
    controllers.forEach((controller: any) => {
      service.register(controller);
      controllersAccumulator.push(controller);
    });

    const imports = Reflect.getOwnMetadata(MODULE_IMPORTS, module) || [];

    for (const importedModule of imports) {
      await this.scanModule(importedModule, service, controllersAccumulator, scannedModules);
    }
  }
}
