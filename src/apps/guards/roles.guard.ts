import { CanActivate, ExecutionContext, Injectable } from "../../core/index.js";

import { ROLES_KEY } from "../decorators/roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.getRoles(context);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.getRequest<Request>();

    const userRole = req.headers['x-role'] as string;

    console.log(`RolesGuard: Required: [${requiredRoles}], User has: ${userRole}`);

    return !!userRole && requiredRoles.includes(userRole);
  }

  private getRoles(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    const controllerClass = context.getClass();

    const methodRoles = Reflect.getMetadata(ROLES_KEY, controllerClass.prototype, handler.name);

    if (methodRoles) {
      return methodRoles;
    }

    const classRoles = Reflect.getMetadata(ROLES_KEY, controllerClass);

    return classRoles || [];
  }
}
