import { ENV } from '$lib/env';

const date = new Date();

export default class Logger {
  static log(str: string, context?: string): void {
    context = context
      ? `@ ${context} - ${date.toLocaleString()}`
      : `@ ${date.toLocaleString()}`;
    const content = `Info: ${str}\n\t${context}`;

    ENV === 'development' && console.log(content);
  }

  static warn(str: string, context?: string): void {
    context = context
      ? `@ ${context} - ${date.toLocaleString()}`
      : `@ ${date.toLocaleString()}`;
    const content = `Warn: ${str}\n\t${context}`;

    ENV === 'development' && console.warn(content);
  }

  static error(str: string, context?: string): void {
    context = context
      ? `@ ${context} - ${date.toLocaleString()}`
      : `@ ${date.toLocaleString()}`;
    const content = `Error: ${str}\n\t${context}`;

    ENV === 'development' && console.error(content);
  }
}
