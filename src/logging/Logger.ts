export interface Logger {
  info(...args: readonly unknown[]): void;
  warn(...args: readonly unknown[]): void;
  error(...args: readonly unknown[]): void;
}
