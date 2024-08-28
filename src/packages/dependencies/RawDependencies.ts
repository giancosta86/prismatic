/**
 * A raw dependency group within a package.json descriptor.
 *
 * For example, "dependencies" or "devDependencies".
 */
export type RawDependencies = Readonly<{
  [name: string]: string;
}>;
