
import { Injectable } from "../../common/decorators/injectable.decorator.js";
import { Module } from "../../common/decorators/module.decorator.js";
import { NestFactory } from "../../common/utils/nest.factory.js";

@Injectable()
class UsersService {
  findAll() { return ['Alice', 'Bob']; }
}


@Injectable()
class AppService {
  constructor(private usersService: UsersService) {}

  printUsers() {
    console.log('Users:', this.usersService.findAll());
  }
}


@Module({
  providers: [UsersService],
})
class UsersModule {}

@Module({
  imports: [UsersModule],
  providers: [AppService],
})
class AppModule {}


export const runMain = async () => {
  console.log("--- Initializing Mini-Nest ---");

  const app = await NestFactory.create(AppModule);

  const appService = app.get<AppService>(AppService);
  appService.printUsers();
}
