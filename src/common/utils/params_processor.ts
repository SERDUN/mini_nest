import { RouteArgsFactory } from "./argument_resolver.js";
import { ArgumentMetadata } from "../types/argument_metadata.js";
import { PipeTransform } from "../types/pipe-transform.js";
import { RouteParamMetadata } from "../decorators/args.decorator.js";
import { Type } from "../types/type.js";
import { ExecutionContext } from "../types/execution-context.js";

export class ParamsProcessor {
  constructor(private readonly routeArgsFactory: RouteArgsFactory) {}

  public async resolve(
    context: ExecutionContext,
    paramMetadata: RouteParamMetadata,
    metatype: any,
    scopedPipes: (PipeTransform | Type<PipeTransform>)[]
  ): Promise<any> {

    const resolver = this.routeArgsFactory.getResolver(paramMetadata.type);

    if (!resolver) {
      return undefined;
    }

    let value = resolver.resolve(context, paramMetadata);

    const allPipes = [
      ...scopedPipes,
      ...(paramMetadata.pipes || [])
    ];

    value = await this.applyPipes(value, allPipes, paramMetadata, metatype);

    return value;
  }

  private async applyPipes(
    value: any,
    pipes: (PipeTransform | Type<PipeTransform>)[],
    paramMetadata: RouteParamMetadata,
    metatype: any
  ): Promise<any> {

    for (const pipeOrClass of pipes) {
      const pipeInstance = this.resolvePipeInstance(pipeOrClass);

      const metadata: ArgumentMetadata = {
        type: paramMetadata.type,
        metatype: metatype,
        data: paramMetadata.data
      };

      value = await pipeInstance.transform(value, metadata);
    }
    return value;
  }

  private resolvePipeInstance(pipeOrClass: PipeTransform | Type<PipeTransform>): PipeTransform {
    if (typeof pipeOrClass === 'function') {
      return new (pipeOrClass as any)();
    }
    return pipeOrClass;
  }
}
