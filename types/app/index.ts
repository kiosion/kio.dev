import type { NumericRange } from '@sveltejs/kit';

declare module '*.md' {
  import type { SvelteComponent } from 'svelte';

  export const metadata: {
    title: string;
    date: string;
    desc?: string;
    tags?: string[];
    draft?: boolean;
    [key: string]: unknown;
  };

  export default class Comp extends SvelteComponent {}
}

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
