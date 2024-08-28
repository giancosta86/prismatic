import { env } from "node:process";

/**
 * Encapsulates a boolean-like environment variable.
 */
export class Flag {
  /**
   * The value the environment variable should be set to in order for the flag to be enabled.
   */
  static readonly ON_VALUE = "1";

  /**
   * The name of the environment variable backing the flag
   */
  constructor(readonly name: string) {}

  /**
   * Lazily checks whether the environment variable has the {@link Flag.ON_VALUE} value.
   */
  isEnabled(): boolean {
    return env[this.name] == Flag.ON_VALUE;
  }
}
