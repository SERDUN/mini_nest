import { ExecutionContext } from "./execution-context.js";

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
