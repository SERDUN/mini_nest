import { Injectable } from "../../common/decorators/injectable.decorator.js";
import { ServiceLocator } from "../../common/utils/service-locator.js";
import { Scope } from "../../common/types/di.scope.js";
import { Inject } from "../../common/decorators/inject.decorator.js";

const RETRY_COUNT = Symbol('RETRY_COUNT');
const RETRY_SUMM = Symbol('RETRY_SUMM');

@Injectable({scope:Scope.TRANSIENT})
export class SampleDependency{
  constructor(@Inject(RETRY_COUNT) private _initial: number=0,@Inject(RETRY_SUMM) private _summ: number=0) {
    console.log("SampleDependency created with initial value:", this._initial);
    this.counter = this._initial;
    console.log("Initialize counter:", this._initial);
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

const sample = () => {
  console.log("Running service example...");
  const serviceLocator = new ServiceLocator();
  serviceLocator.registerType(RETRY_COUNT,4);

  const dependency = new SampleDependency();
  const service = new SampleService(dependency);
  service.execute();

  const myService = serviceLocator.resolve<SampleService>(SampleService);
  myService.execute();
}

export const runServiceExample = () => {
  sample()
}
