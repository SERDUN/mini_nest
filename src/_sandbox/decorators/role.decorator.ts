import "reflect-metadata";

export function Role(role: string) {
  return function (target:any,propertyKey:string,descriptor:PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if(role!="admin"){
        throw new Error(`Access denied. Required role: ${role}`);
      }

      Reflect.defineMetadata("role", role, target, propertyKey);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  }
}

