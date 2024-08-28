import { PathLike, RmOptions } from "node:fs";
import { access, constants, rm } from "node:fs/promises";
import process from "node:process";

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
 * Resolves if the given file/directory exists.
 *
 * Otherwise, rejects with a self-explaining error.
 */
export async function assertExisting(path: string): Promise<void> {
  const existing = await exists(path);

  if (!existing) {
    throw new Error(`Missing file or directory: '${path}'`);
  }
}

/**
 * Resolves if the given file/directory is missing.
 *
 * Otherwise, rejects with a self-explaining error.
 */
export async function assertMissing(path: string): Promise<void> {
  const existing = await exists(path);

  if (existing) {
    throw new Error(`File or directory '${path}' should not exist`);
  }
}

/**
 * Assertion about the existence of a file or directory.
 */
export const assertExistence = (path: string, shouldExist: boolean) =>
  (shouldExist ? assertExisting : assertMissing)(path);

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
export async function safeRm(...paths: PathLike[]): Promise<void> {
  const SAFE_RM_OPTIONS: RmOptions = {
    force: true,
    recursive: true,
    maxRetries: 4,
    retryDelay: 100,
  };

  await Promise.all(paths.map((path) => rm(path, SAFE_RM_OPTIONS)));
}
