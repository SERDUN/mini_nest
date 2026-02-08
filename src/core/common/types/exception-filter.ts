import { ExecutionContext } from "./execution-context.js";

export interface ExceptionFilter<T = any> {
  catch(exception: T, context: ExecutionContext): void;
}
