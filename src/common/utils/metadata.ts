export function getMetadata<T>(key: any, target: any, propertyKey?: string | symbol): T | undefined {
  return (propertyKey ? Reflect.getMetadata(key, target, propertyKey) : Reflect.getMetadata(key, target)) as T | undefined;
}
