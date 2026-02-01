import { Request, Response } from 'express';
import { ArgsType, RouteParamMetadata } from "../decorators/args.decorator.js";

export interface IArgumentResolver {
  resolve(req: Request, res: Response, paramMetadata: RouteParamMetadata): any;
}

export class QueryResolver implements IArgumentResolver {
  resolve(req: Request, res: Response, paramMetadata: RouteParamMetadata): any {
    const key = paramMetadata.data;
    return key ? req.query[key] : req.query;
  }
}

export class RouteArgsFactory {
  private resolvers = new Map<ArgsType, IArgumentResolver>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.resolvers.set(ArgsType.QUERY, new QueryResolver());
  }

  public getResolver(type: ArgsType): IArgumentResolver | undefined {
    return this.resolvers.get(type);
  }
}
