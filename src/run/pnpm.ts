import { runInShell } from "@giancosta86/prismatic/run";

/**
 * Uses `pnpm` to run a pnpm command in the current directory.
 *
 * The command can be a pnpm verb, an NPM script, an NPX command, ...
 *
 * The child process inherits the 3 std streams from this one.
 *
 * In case of success, the function resolves its `Promise`;
 * in case of failure, the error code, if available, is mentioned in the rejection.
 */
export const runWithPnpm = (verb: string, ...args: readonly string[]) =>
  runInShell("pnpm", verb, ...args);
