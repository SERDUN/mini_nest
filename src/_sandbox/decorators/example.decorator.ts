import "reflect-metadata";

function ExampleDecorator(metadata:string){
  return function (target:any,propertyKey:string){
    Reflect.defineMetadata("example-decorator",metadata,target,propertyKey);
  }
}

class ExampleClass{
  @ExampleDecorator("Additional Metadata")
  someMethod(){
    console.log("Inside someMethod");
  }
}

export  const runExampleDecorator = () => {
  const instance = new ExampleClass();
  instance.someMethod();
  const metadata = Reflect.getMetadata("example-decorator", ExampleClass.prototype, "someMethod");
  console.log(metadata);
};
