import "reflect-metadata";

export function ExampleDecorator(metadata:string){
  return function (target:any,propertyKey:string){
    Reflect.defineMetadata("example-decorator",metadata,target,propertyKey);
  }
}
