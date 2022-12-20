import type { Readable, Unsubscriber } from 'svelte/store';

/**
 * Fake a Readable store<T> that returns a value of type T.
 *
 * Useful for unit testing components that rely on stores.
 *
 * @param value The value to return from the store.
 * @returns A fake store<T> that returns the provided value on subscription or get().
 */
export function fakeReadable<T>(value: T): Readable<T> {
  return {
    subscribe: (run: (value: T) => void) => {
      run(value);
      // Return an empty function to satisfy the Unsubscriber type.
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return ((): void => {}) as Unsubscriber;
    }
  };
}
