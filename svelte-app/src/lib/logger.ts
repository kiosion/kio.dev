/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function, prefer-rest-params */
import { ENV } from '$lib/env';
import type { LogOptions } from 'vite';

export class LoggerClass {
  canLog!: boolean;
  prevErrors!: Set<string>;
  prevWarns!: Set<string>;
  hasWarned!: boolean;

  constructor({ ENV }: { ENV: string }) {
    this.canLog = ENV !== 'production';
    this.prevErrors = new Set();
    this.prevWarns = new Set();
    this.hasWarned = false;
  }

  #addTimestamp(msg: string) {
    return `${new Date().toLocaleTimeString()} ${msg}`;
  }

  log(msg: string, options: LogOptions = {}, ...rest: any[]) {
    if (!this.canLog) {
      return;
    }
    const { clear, timestamp } = options ?? {
      clear: false,
      timestamp: false
    };
    if (clear) {
      console.clear();
    }
    msg = timestamp ? this.#addTimestamp(msg) : msg;
    console.log(msg, ...rest);
  }

  info(msg: string, options: LogOptions = {}, ...rest: any[]) {
    if (!this.canLog) {
      return;
    }
    const { clear, timestamp } = options ?? {
      clear: false,
      timestamp: false
    };
    if (clear) {
      console.clear();
    }
    msg = timestamp ? this.#addTimestamp(msg) : msg;
    console.info(msg, ...rest);
  }

  warn(msg: string, options: LogOptions = {}, ...rest: any[]) {
    if (!this.canLog) {
      return;
    }
    const { clear, timestamp } = options ?? {
      clear: false,
      timestamp: false
    };
    if (clear) {
      console.clear();
    }
    msg = timestamp ? this.#addTimestamp(msg) : msg;
    this.hasWarned = true;
    this.prevWarns.add(msg);
    console.warn(msg, ...rest);
  }

  error(msg: string, options: LogOptions = {}, ...rest: any[]) {
    const { clear, timestamp } = options ?? {
      clear: false,
      timestamp: false
    };
    if (clear) {
      console.clear();
    }
    msg = timestamp ? this.#addTimestamp(msg) : msg;
    this.prevErrors.add(msg);
    console.error(msg, ...rest);
  }

  warnOnce(msg: string, options: LogOptions = {}, ...rest: any[]) {
    if (!this.canLog) {
      return;
    }
    if (this.prevWarns.has(msg)) {
      return;
    }
    this.warn(msg, options, ...rest);
  }

  errorOnce(msg: string, options: LogOptions = {}, ...rest: any[]) {
    if (!this.canLog) {
      return;
    }
    if (this.prevErrors.has(msg)) {
      return;
    }
    this.error(msg, options, ...rest);
  }
}

export default new LoggerClass({ ENV });
