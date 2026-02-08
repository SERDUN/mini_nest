import { RouteParamMetadata } from "../decorators/args.decorator.js";
import { ArgsType } from "../types/args-type.js";
import { ExecutionContext } from "../types/execution-context.js";

export interface IArgumentResolver {
  resolve(context: ExecutionContext, paramMetadata: RouteParamMetadata): any;
}

export class QueryResolver implements IArgumentResolver {
  resolve(context: ExecutionContext, paramMetadata: RouteParamMetadata): any {
    const req = context.getRequest();
    const key = paramMetadata.data;
    return key ? req.query[key] : req.query;
  }
}

export class BodyResolver implements IArgumentResolver {
  resolve(context: ExecutionContext, paramMetadata: RouteParamMetadata): any {
    const req = context.getRequest();
    const key = paramMetadata.data;
    return key ? req.body[key] : req.body;
  }
}

export class ParamResolver implements IArgumentResolver {
  resolve(context: ExecutionContext, paramMetadata: RouteParamMetadata): any {
    const req = context.getRequest();
    const key = paramMetadata.data;
    return key ? req.params[key] : req.params;
  }
}

export class RouteArgsFactory {
  private resolvers = new Map<ArgsType, IArgumentResolver>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.resolvers.set(ArgsType.QUERY, new QueryResolver());
    this.resolvers.set(ArgsType.BODY, new BodyResolver());
    this.resolvers.set(ArgsType.PARAM, new ParamResolver());
  }

  public getResolver(type: ArgsType): IArgumentResolver | undefined {
    return this.resolvers.get(type);
  }
}
