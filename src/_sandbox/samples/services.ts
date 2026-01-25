import { Injectable } from "../decorators/injectable.decorator.js";
import { DependencyInjection } from "../utils/dependency-injection.js";

@Injectable()
class SampleDependency{
  do(){
    console.log("Doing dependency detected.");
  }
}

@Injectable()
class SampleService {
  constructor(private _dependency: SampleDependency) {}

  execute() {
    console.log("Executing service...");
    this._dependency.do();
  }
}

export const runServiceExample = () => {
  console.log("Running service example...");

  const dependency = new SampleDependency();
  const service = new SampleService(dependency);
  service.execute();

  const isServiceInjectable = Reflect.getMetadata("injectable", SampleService);
  console.log("Is SampleService injectable?", isServiceInjectable);

  const isDependencyInjectable = Reflect.getMetadata("injectable", SampleDependency);
  console.log("Is SampleDependency injectable?", isDependencyInjectable);

  console.log("DependencyInjection container example:");
  const myService = DependencyInjection.get<SampleService>(SampleService);
  myService.execute();
}
