import { ConsoleLogger } from "./ConsoleLogger.js";
import { LoggerProxy } from "./LoggerProxy.js";

export const prismaticLogger = new LoggerProxy(new ConsoleLogger());
