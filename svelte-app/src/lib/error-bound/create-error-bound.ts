/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';
import type { ComponentProps } from 'svelte';

const GUARDED_BLOCKS = ['c', 'l', 'h', 'm', 'p', 'a', 'i', 'o', 'd'];

export function createErrorBoundary(Component: any) {
  if (Component.$$render) {
    const render = Component.$$render;
    Component.$$render = (
      result: any,
      props: ComponentProps<typeof Component>,
      bindings: any,
      slots: any
    ) => {
      const error = writable<Error | undefined>(undefined);

      try {
        return render(result, { error, ...props }, bindings, slots);
      } catch (err) {
        error.set(err as Error);
        return render(result, { error, ...props }, bindings, {});
      }
    };

    return Component;
  }

  function guard(fn: any, onError: any) {
    return function guarded(...args: any) {
      try {
        return fn(...args);
      } catch (err) {
        onError(err);
      }
    };
  }

  return class ErrorBoundaryComponent extends Component {
    constructor(config: any) {
      const error = writable<Error | undefined>(undefined);

      config.props.$$slots.default = config.props.$$slots.default.map(
        (slot: any) =>
          (...args: any) => {
            const guarded = guard(slot, error.set);
            const block = guarded(...args);

            if (block) {
              for (const fn of GUARDED_BLOCKS) {
                if (block[fn]) {
                  block[fn] = guard(block[fn], error.set);
                }
              }
            }

            return block;
          }
      );

      super(config);

      this.$$set({ error });
    }
  };
}
