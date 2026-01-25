import { Injectable, InjectableMetadata } from "../../common/decorators/injectable.decorator.js";
import { ServiceLocator } from "../../common/utils/service-locator.js";
import { getMetadata } from "../../common/utils/metadata.js";
import { INJECTABLE } from "../../common/types/metadata.keys.js";
import { Scope } from "../../common/types/di.scope.js";

@Injectable({scope:Scope.TRANSIENT})
class SampleDependency{
  constructor(private _initial: number=0) {
    this.counter = this._initial;
  }

  private counter:number=0;

  do(){
    this.counter++;
    console.log("SampleDependency doing work... Count:", this.counter);
  }
}

@Injectable({scope:Scope.TRANSIENT})
class SampleService {
  constructor(private _dependency: SampleDependency) {}

  execute() {
    console.log("Executing service...");
    this._dependency.do();
  }
}

const sample1 = () => {
  console.log("Running service example...");

  const dependency = new SampleDependency();
  const service = new SampleService(dependency);
  service.execute();

  // const isServiceInjectable = Reflect.getMetadata("injectable", SampleService);
  const isServiceInjectable = getMetadata<InjectableMetadata>(INJECTABLE, SampleService);
  console.log("Is SampleService injectable?", isServiceInjectable?.injectable);

  // const isDependencyInjectable = Reflect.getMetadata("injectable", SampleDependency);
  const isDependencyInjectable = getMetadata<InjectableMetadata>(INJECTABLE, SampleDependency);
  console.log("Is SampleDependency injectable?", isDependencyInjectable?.injectable);

  console.log("DependencyInjection container example:");
  const myService = ServiceLocator.resolve<SampleService>(SampleService);

  myService.execute();
}

export const runServiceExample = () => {
  const myService = ServiceLocator.resolve<SampleService>(SampleService);
  myService.execute();
  const myService1 = ServiceLocator.resolve<SampleService>(SampleService);
  myService1.execute();
  const myService2 = ServiceLocator.resolve<SampleService>(SampleService);
  myService2.execute();
}
