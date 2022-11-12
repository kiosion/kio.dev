/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import { ENV } from '$lib/env';

export default class Logger {
  static log(..._args: unknown[]): void {
    ['development', 'backed'].includes(ENV) && console.log(...arguments);
  }

  static info(..._args: unknown[]): void {
    ['development', 'backed'].includes(ENV) && console.info(...arguments);
  }

  static warn(..._args: unknown[]): void {
    ['development', 'backed'].includes(ENV) && console.warn(...arguments);
  }

  static error(..._args: unknown[]): void {
    ['development', 'backed'].includes(ENV) && console.error(...arguments);
  }
}
