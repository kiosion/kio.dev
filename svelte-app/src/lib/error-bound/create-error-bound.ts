/* eslint-disable */
// This file's a mess in terms of types, but works, so I'm leaving it as is for now :)

import { writable } from 'svelte/store';
import type { ComponentProps } from 'svelte';
import type { SvelteComponentDev } from 'svelte/internal';

const GUARDED_BLOCKS = ['c', 'l', 'h', 'm', 'p', 'a', 'i', 'o', 'd'];

export function createErrorBoundary(Component: SvelteComponentDev) {
  if (Component.$$render) {
    const render = Component.$$render as (
      result: any,
      props: ComponentProps<typeof Component>,
      bindings: any,
      slots: any
    ) => unknown;
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

  function guard(
    fn: (args: any) => unknown,
    onError: (err: unknown) => unknown
  ) {
    return function guarded(...args: any) {
      try {
        // @ts-expect-error Spread operator
        return fn(...args); // eslint-disable-line @typescript-eslint/no-unsafe-argument
      } catch (err) {
        onError(err);
      }
    };
  }

  // @ts-expect-error SvelteComponentDev isn't typed for constructor
  return class ErrorBoundaryComponent extends Component {
    constructor(config: { props: ComponentProps<typeof Component> }) {
      const error = writable<Error | undefined>(undefined);

      config.props.$$slots.default = config.props.$$slots.default.map(
        (slot: any) =>
          (...args: any) => {
            // @ts-expect-error Wrong typing for guard()
            const guarded = guard(slot, error.set);
            const block = guarded(...args);

            if (block) {
              for (const fn of GUARDED_BLOCKS) {
                // @ts-expect-error Wrong typing for block obj
                if (block[fn] as unknown) {
                  // @ts-ignore
                  block[fn] = guard(block[fn], error.set);
                }
              }
            }

            return block;
          }
      );

      super(config);

      // @ts-ignore
      this.$$set({ error });
    }
  };
}
