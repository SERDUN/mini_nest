import { z } from "zod";
import {
  AuthGuard,
  Body,
  Controller,
  Get,
  HttpExceptionFilter,
  Injectable,
  Module,
  MODULE_CONTROLLERS_PREFIX,
  MODULE_CONTROLLERS_REQUEST,
  MODULE_CONTROLLERS_REQUEST_ARGS,
  NestFactory,
  ParseIntPipe,
  Post,
  Query,
  TransformInterceptor,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes, ValidationPipe,
  ZodValidationPipe
} from "../../core/index.js";

const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 chars"),
  age: z.number().int().positive("Age must be positive"),
  email: z.string().email("Invalid email format")
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;

@Injectable()
class UsersService {
  private users = ['Alice', 'Bob'];

  findAll() { return this.users; }

  create(user: CreateUserDto) {
    this.users.push(user.name);
    return user;
  }
}

@UsePipes(new ValidationPipe("Controller-level pipe"))
@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller("/user")
@UseFilters(HttpExceptionFilter)
class UserController {
  constructor(private usersService: UsersService) {}

  @Get('/users')
  getUsers(@Query("uuid") uuid: string) {
    console.log("UUID Query:", uuid);
    return this.usersService.findAll();
  }

  @Get('/status')
  getStatus(
    @Query("country") country: string,
    @Query("limit", ParseIntPipe) limit: number
  ) {
    console.log("Status Params:", country, limit);
    return { status: 'ok', country, limit };
  }

  @Post('/create')
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  createUser(@Body() body: CreateUserDto) {
    console.log("Creating user:", body);
    return this.usersService.create(body);
  }
}

@Module({
  providers: [UsersService],
  controllers: [UserController],
})
class UsersModule {}

@Module({
  imports: [UsersModule],
  providers: [AuthGuard,HttpExceptionFilter,TransformInterceptor],
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
  app.use((req, res, next) => {
    console.log(`[Middleware] Incoming request: ${req.method} ${req.url}`);
    next();
  });
  app.useGlobalPipes(new ValidationPipe("Global pipe"));

  await app.listen(3000);
}
