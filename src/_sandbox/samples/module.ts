import { Module } from "../../core/common/decorators/module.decorator.js";
import { MODULE_CONTROLLERS, MODULE_IMPORTS, MODULE_PROVIDERS } from "../../core/common/types/metadata.keys.js";

export class UserService {
  getUser() {
    return { id: 1, name: 'John Doe' };
  }
}

export class UserController {
  constructor(private readonly userService: UserService) {}
  getUser() {
    return this.userService.getUser();
  }
}

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

export const runModuleExample = () => {
  const imports = Reflect.getOwnMetadata(MODULE_IMPORTS, UserModule);
  const providers = Reflect.getOwnMetadata(MODULE_PROVIDERS, UserModule);
  const controllers = Reflect.getOwnMetadata(MODULE_CONTROLLERS, UserModule);

  console.log("Module Imports:", imports);
  console.log("Module Providers:", providers);
  console.log("Module Controllers:", controllers);
}
