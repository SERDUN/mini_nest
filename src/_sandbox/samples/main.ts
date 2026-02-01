
import { Injectable } from "../../common/decorators/injectable.decorator.js";
import { Module } from "../../common/decorators/module.decorator.js";
import { NestFactory } from "../../common/utils/nest.factory.js";
import { Get } from "../../common/decorators/request.decorator.js";
import { Controller } from "../../common/decorators/controller.decorator.js";
import { MODULE_CONTROLLERS_PREFIX, MODULE_CONTROLLERS_REQUEST, MODULE_CONTROLLERS_REQUEST_ARGS } from "../../common/types/metadata.keys.js";
import { Query } from "../../common/decorators/args.decorator.js";

@Injectable()
class UsersService {
  findAll() { return ['Alice', 'Bob']; }
}

@Controller("/user")
class UserController {
  constructor(private usersService: UsersService) {}
  @Get('/users')
  getUsers(@Query("uuid") uuid: string) {
    console.log(uuid);
    const users=this.usersService.findAll();
    users.push(uuid)
    return users;
  }

  @Get('/status')
    getStatus(@Query("country") country: string,@Query("limit") limit: number) {
    console.log(country, limit);
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

  const params=Reflect.getOwnMetadata(MODULE_CONTROLLERS_REQUEST_ARGS, controller.prototype);
    console.log(`Controller ${controller.name} params:`, params);
}

const runMock= async ()=> {
  console.log("--- Initializing Mini-Nest ---");

  const app = await NestFactory.create(AppModule);

  const userController = app.get<UserController>(UserController);
  const users=userController.getUsers("123e4567-e89b-12d3-a456-426614174000");
  console.log("Fetched users:", users);

  _printControllerMetadata(UserController);

}

export const runMain = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
