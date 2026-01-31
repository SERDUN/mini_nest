import { ServiceLocator } from "./service-locator.js";

export class NestApplication {
  constructor(private readonly serviceLocator: ServiceLocator) {}

  public get<T>(token: any): T {
    return this.serviceLocator.resolve<T>(token);
  }

  public async listen(port: number) {
    console.log(` Mini-Nest application is running on port ${port}`);
  }
}
