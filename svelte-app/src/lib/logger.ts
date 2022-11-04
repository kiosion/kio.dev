import { ENV } from '$lib/env';

export default class Logger {
  static log(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Info: ${str}\n\t${context}`;

    ENV === 'development' && console.log(content);
  }

  static info(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Info: ${str}\n\t${context}`;

    ENV === 'development' && console.info(content);
  }

  static warn(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Warn: ${str}\n\t${context}`;

    ENV === 'development' && console.warn(content);
  }

  static error(str: string, context?: string): void {
    context = context ? `@ ${context}` : '';
    const content = `Error: ${str}\n\t${context}`;

    ENV === 'development' && console.error(content);
  }
}
