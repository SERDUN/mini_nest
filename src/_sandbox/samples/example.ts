import { ExampleDecorator } from "../decorators/example.decorator.js";

class ExampleClass{
  @ExampleDecorator("Additional Metadata")
  someMethod(){
    console.log("Inside someMethod");
  }
}

export const runExampleDecorator = () => {
  const instance = new ExampleClass();
  instance.someMethod();
  const metadata = Reflect.getMetadata("example-decorator", ExampleClass.prototype, "someMethod");
  console.log(metadata);
};
