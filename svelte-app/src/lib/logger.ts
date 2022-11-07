import { ENV } from '$lib/env';

export default class Logger {
  static log(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Info: ${str}${context ? '\n\t' : ''}${context}`;

    ['development', 'backed'].includes(ENV) && console.log(content);
  }

  static info(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Info: ${str}${context ? '\n\t' : ''}${context}`;

    ['development', 'backed'].includes(ENV) && console.info(content);
  }

  static warn(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Warn: ${str}${context ? '\n\t' : ''}${context}`;

    ['development', 'backed'].includes(ENV) && console.warn(content);
  }

  static error(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Error: ${str}${context ? '\n\t' : ''}${context}`;

    ['development', 'backed'].includes(ENV) && console.error(content);
  }
}
