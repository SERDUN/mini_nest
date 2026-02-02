import { Request, Response } from 'express';
import {  RouteParamMetadata } from "../decorators/args.decorator.js";
import { Paramtype } from "../types/paramtype.js";

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
  private resolvers = new Map<Paramtype, IArgumentResolver>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.resolvers.set(Paramtype.QUERY, new QueryResolver());
  }

  public getResolver(type: Paramtype): IArgumentResolver | undefined {
    return this.resolvers.get(type);
  }
}
