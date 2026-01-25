import { DESIGN_PARAMTYPES, INJECTABLE } from "../types/metadata.keys.js";
import { InjectableMetadata } from "../decorators/injectable.decorator.js";
import { getMetadata } from "./metadata.js";
import { Scope } from "../types/di.scope.js";

export class ServiceLocator {
  private static cache: Map<any, any> = new Map();

  static resolve<T>(target: any): T {
    const metadata = getMetadata<InjectableMetadata>(INJECTABLE, target)

    if (!metadata?.injectable) {
      throw new Error("Target is not injectable");
    }

    const dependencies = Reflect.getMetadata(DESIGN_PARAMTYPES, target) || [];
    const instances = dependencies.map((dependency: any) => ServiceLocator.resolve(dependency));

    if(metadata.scope==Scope.DEFAULT){
      if(ServiceLocator.cache.has(target)){
        return ServiceLocator.cache.get(target);
      }else {
        const instance = new target(...instances);
        ServiceLocator.cache.set(target,instance);
        return instance;
      }
    }

    return new target(...instances);
  }
}
