import { CanActivate } from "../common/types/can_activate.js";
import { ExecutionContext } from "../common/types/execution-context.js";

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      console.warn('Authorization header missing');
      return false;
    }

    return true;
  }
}
