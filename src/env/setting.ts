import { env } from "node:process";
import { Flag } from "./flags.js";

/**
 * Sets the given env variable to the given value, for the duration of a closure.
 *
 * In the end, the previous value (or its absence) is restored.
 */
export async function withEnv(
  key: string,
  value: string,
  closure: () => void | Promise<void>
): Promise<void> {
  const oldValue = env[key];

  env[key] = value;

  try {
    await closure();
  } finally {
    if (oldValue !== undefined) {
      env[key] = oldValue;
    } else {
      delete env[key];
    }
  }
}

/**
 * Removes the given env variable, for the duration of a closure.
 *
 * In the end, the previous value is restored if it was present.
 */
export async function withoutEnv(
  key: string,
  closure: () => void | Promise<void>
): Promise<void> {
  const oldValue = env[key];

  delete env[key];

  try {
    await closure();
  } finally {
    if (oldValue !== undefined) {
      env[key] = oldValue;
    } else {
      delete env[key];
    }
  }
}

/**
 * Enables the given flag, for the duration of a closure.
 */
export const withFlag = (
  key: string | Flag,
  closure: () => void | Promise<void>
) => {
  const actualKey = typeof key == "string" ? key : key.name;

  return withEnv(actualKey, Flag.ON_VALUE, closure);
};

/**
 * Disables the given flag, for the duration of a closure.
 */
export const withoutFlag = (
  key: string | Flag,
  closure: () => void | Promise<void>
) => {
  const actualKey = typeof key == "string" ? key : key.name;

  return withoutEnv(actualKey, closure);
};
