/**
 * Represents a generic class constructor (type reference).
 * Used to pass class definitions to functions or decorators.
 */
export interface Type<T = any> {
  /**
   * Constructor signature allowing instantiation via `new`.
   */
  new (...args: any[]): T;
}
