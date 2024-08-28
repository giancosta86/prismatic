import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Writes a string to a file, recursively creating
 * the required directory structure.
 */
export async function writeToArbitraryFile(
  file: string,
  content: string = ""
): Promise<void> {
  const directory = dirname(file);

  await mkdir(directory, { recursive: true });

  return writeFile(file, content, { encoding: "utf8" });
}
