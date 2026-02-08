import { ArgsType } from "./args-type.js";
import { Type } from "./type.js";

export interface ArgumentMetadata {
  /**
   * The decorator type used (e.g., @Body, @Query).
   */
  type: ArgsType;

  /**
   * The data type expected by the controller method (e.g., String, UserDto).
   * This is a reference to the class constructor.
   */
  metatype?: Type<any> | Function;

  /**
   * The string passed to the decorator (e.g., "id" for @Query("id")).
   * Undefined if the decorator is empty (@Body()).
   */
  data?: string;
}
