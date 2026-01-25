import { Role } from "../decorators/role.decorator.js";

class User{
  private _username: string;
  private _password: string;

  constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }

  @Role('admin')
  getUsername() {
    return this._username;
  }

  @Role('admin')
  setPassword(newPassword: string) {
    this._password = newPassword;
  }

  @Role('user')
  changePassword(newPassword, oldPassword: string) {
    if (oldPassword !== this._password) {
      throw new Error("Old password does not match.");
    }

    this.setPassword(newPassword);
    console.log("Password changed successfully.");
  }
}

export const runUserExample = () => {
  console.log("Running user example...");
    const user = new User("testUser", "securePassword");
    const  username = user.getUsername();

    console.log(`Username: ${username}`);

    const role0=Reflect.getMetadata("role", User.prototype, "getUsername");
    console.log("Role for getUsername:", role0);
    const role1=Reflect.getMetadata("role", User.prototype, "changePassword");
    console.log("Role for changePassword:", role1);
}
