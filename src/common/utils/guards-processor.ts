import { CanActivate } from "../types/can_activate.js";
import { Type } from "../types/type.js";
import { MODULE_GUARDS_KEY } from "../types/metadata.keys.js";
import { ExecutionContext } from "../types/execution-context.js";

export class GuardsConsumer {
  public async tryActivate(
    context: ExecutionContext,
    globalGuards: (CanActivate | Type<CanActivate>)[]
  ): Promise<void> {
    const controllerClass = context.getClass();
    const handler = context.getHandler();

    const controllerGuards = this.getGuards(controllerClass);
    const methodGuards = this.getGuards(controllerClass.prototype, handler.name);

    const allGuards = [
      ...globalGuards,
      ...controllerGuards,
      ...methodGuards
    ];

    if (allGuards.length === 0) {
      return;
    }

    for (const guardOrType of allGuards) {
      const guardInstance = this.resolveGuardInstance(guardOrType);

      const canActivate = await guardInstance.canActivate(context);

      if (!canActivate) {
        throw new Error("ForbiddenResource");
      }
    }
  }

  private getGuards(target: any, propertyKey?: string | symbol): (CanActivate | Type<CanActivate>)[] {
    if (propertyKey) {
      return Reflect.getMetadata(MODULE_GUARDS_KEY, target, propertyKey) || [];
    }
    return Reflect.getMetadata(MODULE_GUARDS_KEY, target) || [];
  }

  private resolveGuardInstance(guardOrType: CanActivate | Type<CanActivate>): CanActivate {
    if (typeof guardOrType === 'function') {
      return new (guardOrType as any)();
    }
    return guardOrType;
  }
}
