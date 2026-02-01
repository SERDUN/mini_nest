
import { Injectable } from "../../common/decorators/injectable.decorator.js";
import { Module } from "../../common/decorators/module.decorator.js";
import { NestFactory } from "../../common/utils/nest.factory.js";
import { Get } from "../../common/decorators/request.decorator.js";
import { Controller } from "../../common/decorators/controller.decorator.js";
import { MODULE_CONTROLLERS_PREFIX, MODULE_CONTROLLERS_REQUEST } from "../../common/types/metadata.keys.js";

@Injectable()
class UsersService {
  findAll() { return ['Alice', 'Bob']; }
}

@Controller("/user")
class UserController {
  constructor(private usersService: UsersService) {}
  @Get('/users')
  getUsers() {
    return this.usersService.findAll();
  }

  @Get('/status')
  getStatus() {
    return {status: 'ok'};
  }
}

@Module({
  providers: [UsersService],
  controllers: [UserController],
})
class UsersModule {}

@Module({
  imports: [UsersModule],
})
class AppModule {}

function _printControllerMetadata(controller:any){
  const routes = Reflect.getOwnMetadata(MODULE_CONTROLLERS_PREFIX, controller);
  console.log(`Controller ${controller.name} routes:`, routes);

  const methods=Reflect.getOwnMetadata(MODULE_CONTROLLERS_REQUEST, controller.prototype);
  console.log(`Controller ${controller.name} methods:`, methods);
}

const runMock= async ()=> {
  console.log("--- Initializing Mini-Nest ---");

  const app = await NestFactory.create(AppModule);

  const userController = app.get<UserController>(UserController);
  const users=userController.getUsers();
  console.log("Fetched users:", users);

  _printControllerMetadata(UserController);

}

export const runMain = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
