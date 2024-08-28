import process from "node:process";

/**
 * Temporarily changes the command-line arguments.
 *
 * The first two elements of {@link process.argv} stay untouched.
 *
 * At the end of the closure, the original `argv` values are restored.
 */
export async function withCliArgs(
  customArgs: readonly string[],
  closure: () => void | Promise<void>
): Promise<void> {
  const savedArgv = process.argv;

  try {
    process.argv = [...savedArgv.slice(0, 2), ...customArgs];
    await closure();
  } finally {
    process.argv = savedArgv;
  }
}
