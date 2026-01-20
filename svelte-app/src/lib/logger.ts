/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENV } from '$lib/env';

const canLog = ENV !== 'production',
  prevErrors = new Set(),
  prevWarns = new Set();

const addTimestamp = (s: string) =>
  `[${new Date().toLocaleTimeString('en-CA', { hour12: false })}] ${s}`;

const log = (msg: string, ...rest: any[]) => {
  console.log(addTimestamp(msg), ...rest);
};

const info = (msg: string, ...rest: any[]) => {
  if (!canLog) {
    return;
  }
  console.info(addTimestamp(msg), ...rest);
};

const warn = (msg: string, ...rest: any[]) => {
  if (!canLog) {
    return;
  }
  console.warn(addTimestamp(msg), ...rest);
  prevWarns.add(`${msg}${JSON.stringify(rest)}`);
};

const error = (msg: string, ...rest: any[]) => {
  if (!canLog) {
    return;
  }
  console.error(addTimestamp(msg), ...rest);
  prevErrors.add(`${msg}${JSON.stringify(rest)}`);
};

const warnOnce = (msg: string, ...rest: any[]) => {
  if (!canLog || prevWarns.has(`${msg}${JSON.stringify(rest)}`)) {
    return;
  }
  warn(msg, ...rest);
};

const errorOnce = (msg: string, ...rest: any[]) => {
  if (!canLog || prevErrors.has(`${msg}${JSON.stringify(rest)}`)) {
    return;
  }
  error(msg, ...rest);
};

export default {
  log,
  info,
  warn,
  error,
  warnOnce,
  errorOnce,
};
