export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => {
  return (target: Object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata(ROLES_KEY, roles, target, propertyKey);
    } else {
      Reflect.defineMetadata(ROLES_KEY, roles, target);
    }
  };
};
