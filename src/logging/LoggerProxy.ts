import { Logger } from "./Logger.js";

/**
 * {@link Logger} implementation delegating its operations to a wrapped instance.
 *
 * The wrapped instance can be set via the {@link instance} property.
 */
export class LoggerProxy implements Logger {
  constructor(private _instance: Logger) {}

  set instance(value: Logger) {
    this._instance = value;
  }

  info(...args: readonly unknown[]): void {
    this._instance.info(...args);
  }

  warn(...args: readonly unknown[]): void {
    this._instance.warn(...args);
  }

  error(...args: readonly unknown[]): void {
    this._instance.error(...args);
  }
}
