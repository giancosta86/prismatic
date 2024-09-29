import { access, constants } from "node:fs/promises";
import process from "node:process";
import { rimraf } from "rimraf";

/**
 * Returns true if the given file or directory exists.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Temporarily switches to a given directory.
 *
 * As soon as the closure ends, no matter how, the previous
 * current directory is restored.
 */
export async function switchToDirectory(
  directory: string,
  action: () => void | Promise<void>
): Promise<void> {
  const oldDirectory = process.cwd();

  process.chdir(directory);
  try {
    await action();
  } finally {
    process.chdir(oldDirectory);
  }
}

/**
 * Recursively deletes files and directories, applying retries in case of errors.
 */
export async function safeRm(...paths: string[]): Promise<void> {
  await rimraf(paths, {
    glob: true,
    retryDelay: 100,
    maxRetries: 4,
  });
}
