export class DependencyInjection {
  static get<T>(target: any): T {
    console.log("Dependency in dependency injection", target);
    const isInjectable = Reflect.getMetadata("injectable", target);
    if (!isInjectable) {
      throw new Error("Target is not injectable");
    }

    const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
    console.log("Dependencies:", dependencies);
    const instances = dependencies.map((dependency: any) => DependencyInjection.get(dependency));
    return new target(...instances);
  }
}
