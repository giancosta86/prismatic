import { spawn } from "node:child_process";
import { prismaticLogger } from "~/logging";

export function runInShell(
  command: string,
  ...args: readonly string[]
): Promise<void> {
  prismaticLogger.info("Running command", command, "with args:", args);

  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(command, args, {
      stdio: "inherit",
      shell: true
    });

    childProcess.on("exit", exitCode => {
      if (exitCode) {
        reject(new Error(`The invoked process exited with code: ${exitCode}`));
      } else {
        resolve();
      }
    });

    childProcess.on("error", err => {
      reject(err);
    });
  });
}
