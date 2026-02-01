export class PathUtils {
  static join(prefix: string, path: string): string {
    let result = `/${prefix}/${path}`;

    result = result.replace(/\/+/g, '/');

    if (result.length > 1 && result.endsWith('/')) {
      result = result.slice(0, -1);
    }

    return result;
  }
}
