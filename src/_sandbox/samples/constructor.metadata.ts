import { addConstructorMetadata, EXAMPLE_CONSTRUCTOR_METADATA_KEY } from "../decorators/constructor.decorator.js";

const Symbol1 = Symbol('Symbol1');

export class SideDependency{
  constructor(@addConstructorMetadata(Symbol1) private _initial: number=0) {
    this.counter = this._initial;
  }

  private counter:number=0;

  do(){
    this.counter++;
    console.log("SideDependency doing work... Count:", this.counter);
  }
}

class MainService {
  constructor(private _dependency: SideDependency) {}

  execute() {
    this._dependency.do();
  }
}

export const runConstructorDecoratorExample = () => {
    console.log("Running clean vs dirty prototype example...");

    const sideDependency = new SideDependency();
    const mainService = new MainService(sideDependency);

    const mainServiceInjectMetadata = Reflect.getOwnMetadata(EXAMPLE_CONSTRUCTOR_METADATA_KEY, MainService);
    console.log(`MainService injection metadata: `, mainServiceInjectMetadata);

    const sideDependencyInjectMetadata = Reflect.getOwnMetadata(EXAMPLE_CONSTRUCTOR_METADATA_KEY, SideDependency);
    console.log(`SideDependency injection metadata: `, sideDependencyInjectMetadata);


  mainService.execute();
}
