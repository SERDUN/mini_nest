import { DESIGN_PARAMTYPES, INJECT, INJECTABLE } from "../types/metadata.keys.js";
import { InjectableMetadata } from "../decorators/injectable.decorator.js";
import { Scope } from "../types/di.scope.js";
import { InjectionToken } from "../decorators/inject.decorator.js";
import { SampleDependency } from "../../_sandbox/samples/index.js";

export class ServiceLocator {
  private static cache: Map<any, any> = new Map();
  private static typeCache: Map<any, any> = new Map();

  static resolve<T>(target: any): T {
    console.log(`ServiceLocator: Resolving target:`, target);

    const injectableMetadata = Reflect.getMetadata(INJECTABLE, target)
    const injectable=injectableMetadata?.injectable;

    const injectMetadata = Reflect.getOwnMetadata(INJECT, target);
    const constructorTokens = injectMetadata ? injectMetadata["constructor"] ?? {} : {};

    console.log(`ServiceLocator: Constructor injection tokens for target: `, constructorTokens);

    if (!injectable ) {
      throw new Error("Target is not injectable");
    }

    const dependencies = Reflect.getMetadata(DESIGN_PARAMTYPES, target) || [];

    const instances = dependencies.map((dependency: any, index: number) => {
      const token = constructorTokens[index];

        if (token) {
          const value = ServiceLocator.resolveType(token);

          if (value === undefined) {
            throw new Error(`DI Error: Token ${token.toString()} was injected at index ${index}, but no value was registered for it.`);
          }

          return ServiceLocator.resolveType(token);
        }

      const isPrimitiveOrInterface = [Number, String, Boolean, Object, Symbol].includes(dependency);

      if (isPrimitiveOrInterface) {
        throw new Error(
          `DI Error: Cannot resolve dependency at index ${index}. ` +
          `It is a primitive or interface (${dependency.name}), but no @Inject() token was provided.`
        );
      }

      return ServiceLocator.resolve(dependency);
    });

    if(injectableMetadata!.scope==Scope.DEFAULT){
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

  static resolveType(token: InjectionToken): any {
    const type = this.typeCache.get(token);
    console.log(`Resolving type for token: ${token.toString()}`, { token, type });
    return type;
  }

  static registerType(token: InjectionToken, type: any): void {
    console.log(`Registering type for token: ${token.toString()}`, { token, type });
    this.typeCache.set(token, type);
  }
}
