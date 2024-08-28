import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { PrismaticFlags } from "~/env";
import { prismaticLogger } from "~/logging";
import { safeRm, switchToDirectory } from "./paths.js";

/**
 * Creates a temporary directory, in the system's temp root, returning its path.
 *
 * The `basename` parameter is used to generate the temp directory prefix.
 *
 * It is up to the client - or system-dependent - to delete the directory in the end.
 */
export async function createTempDirectory(basename: string): Promise<string> {
  const tempDirectory = await mkdtemp(join(tmpdir(), `${basename}_`));

  prismaticLogger.info("Created temp directory:", tempDirectory);

  return tempDirectory;
}

/**
 * Removes a temporary directory.
 *
 * Actually, the directory can be kept if the
 * {@link PrismaticFlags.keepTempDirectory} environment flag
 * is enabled.
 */
export async function rmTempDirectory(tempDirectory: string): Promise<void> {
  if (!PrismaticFlags.keepTempDirectory.isEnabled()) {
    await safeRm(tempDirectory);
  }
}

/**
 * Closure used to work with a temporary directory.
 */
export type TempDirectoryConsumer = (
  tempDirectory: string
) => void | Promise<void>;

/**
 * Creates a temporary directory, deleting it in the end.
 *
 * The temporary directory can be kept by enabling the
 * {@link PrismaticFlags.keepTempDirectory} environment flag.
 *
 * The `basename` parameter is used when generating the temporary directory prefix.
 */
export async function withTempDirectory(
  basename: string,
  consumer: TempDirectoryConsumer
): Promise<void> {
  const tempDirectory = await createTempDirectory(basename);

  try {
    await consumer(tempDirectory);
  } finally {
    await rmTempDirectory(tempDirectory);
  }
}

/**
 * Creates a temporary directory and uses it as the current directory.
 *
 * As soon as the closure ends, the previous directory is restored
 * even if the temporary directory is kept.
 *
 * The optional `basename` parameter is used when generating the
 * temporary directory; if missing, a default is provided.
 */
export async function switchToTempDirectory(
  consumer: TempDirectoryConsumer
): Promise<void>;

export async function switchToTempDirectory(
  basename: string,
  consumer: TempDirectoryConsumer
): Promise<void>;

export async function switchToTempDirectory(
  basenameOrConsumer: string | TempDirectoryConsumer,
  consumer?: TempDirectoryConsumer
): Promise<void> {
  const [actualBaseName, actualConsumer] =
    typeof basenameOrConsumer == "string"
      ? [basenameOrConsumer, consumer!]
      : ["prismatic", basenameOrConsumer];

  return withTempDirectory(actualBaseName, tempDirectory =>
    switchToDirectory(tempDirectory, () => actualConsumer(tempDirectory))
  );
}
