import type { NumericRange } from '@sveltejs/kit';

declare global {
  interface ErrorOptions {
    // @ts-expect-error - Overriding base type
    cause?: (string | { message?: string; detail?: string | { message?: string } })[];
    stack?: string;
    code?: NumericRange<400, 599>;
  }

  interface ErrorConstructor {
    new (message?: string, options?: ErrorOptions): Error;
    (message?: string, options?: ErrorOptions): Error;
  }

  interface Error {
    message: string;
    // @ts-expect-error - Overriding base type
    cause?: (string | { message?: string; detail?: string | { message?: string } })[];
    stack?: string;
    code?: NumericRange<400, 599>;
  }
}

export {};
