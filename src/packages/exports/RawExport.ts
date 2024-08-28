/**
 * Raw export entry value within a package.json descriptor.
 */
export type RawExport = Readonly<{
  types: string;
  import: string;
}>;
