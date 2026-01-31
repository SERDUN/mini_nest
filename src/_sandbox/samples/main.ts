
import { Injectable } from "../../common/decorators/injectable.decorator.js";
import { Module } from "../../common/decorators/module.decorator.js";
import { NestFactory } from "../../common/utils/nest.factory.js";

@Injectable()
class LoggerService {
  log(message: string) {
    console.log(`[Logger]: ${message}`);
  }
}

@Injectable()
class AppService {
  constructor(private logger: LoggerService) {}

  getHello() {
    this.logger.log("Returning hello message");
    return "Hello form Mini-Nest!";
  }
}

@Module({
  providers: [AppService, LoggerService],
})
class AppModule {}


export const runMain = async () => {
  console.log("--- Initializing Mini-Nest ---");

  const app = await NestFactory.create(AppModule);

  const appService = app.get<AppService>(AppService);

  console.log(appService.getHello());
}
