import { Logger } from "./Logger.js";

export class ConsoleLogger implements Logger {
  info(...args: readonly unknown[]): void {
    console.info(...args);
  }

  warn(...args: readonly unknown[]): void {
    console.warn(...args);
  }

  error(...args: readonly unknown[]): void {
    console.error(...args);
  }
}
