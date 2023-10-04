import { SvelteComponent } from 'svelte';
import { derived, readable, writable } from 'svelte/store';

import type { ComponentType } from 'svelte';
import type {
  HighlightEvents,
  HighlightProps,
  HighlightSlots
} from 'svelte-highlight/Highlight.svelte';
import type {
  HighlightSvelteEvents,
  HighlightSvelteProps,
  HighlightSvelteSlots
} from 'svelte-highlight/HighlightSvelte.svelte';
import type { LanguageType } from 'svelte-highlight/languages';
import type {
  LineNumbersEvents,
  LineNumbersProps,
  LineNumbersSlots
} from 'svelte-highlight/LineNumbers.svelte';

class _LineNumbers extends SvelteComponent<
  LineNumbersProps,
  LineNumbersEvents,
  LineNumbersSlots
> {}
class _HighlightSvelte extends SvelteComponent<
  HighlightSvelteProps,
  HighlightSvelteEvents,
  HighlightSvelteSlots
> {}
class _Highlight extends SvelteComponent<
  HighlightProps,
  HighlightEvents,
  HighlightSlots
> {}

export type LineNumbers = ComponentType<_LineNumbers>;
export type HighlightSvelte = ComponentType<_HighlightSvelte>;
export type Highlight = ComponentType<_Highlight>;

const stores = {
  LineNumbers: writable<Promise<LineNumbers> | undefined>(undefined),
  HighlightSvelte: writable<Promise<HighlightSvelte> | undefined>(undefined),
  Highlight: writable<Promise<Highlight> | undefined>(undefined)
} as const;

const genericDerivedAsyncImport = <K extends keyof typeof stores>(
    name: K,
    target: (typeof stores)[K]
  ) =>
    derived(target, (value: Parameters<(typeof target)['set']>[0]) => {
      if (value === undefined) {
        const promise = import(
          `../../../node_modules/svelte-highlight/${name}.svelte`
        ).then((module) => module.default) as unknown as NonNullable<typeof value>;
        // @ts-expect-error - TS infers target['set'] here as an Intersection of Writable ReturnTypes rather than Unions
        target.set(promise);
        return promise;
      }
      return value;
    }),
  empty = () =>
    readable<Promise<undefined>>(new Promise((resolve) => resolve(undefined)));

const lineNumbers = (useLineNumbers: boolean) => {
    return useLineNumbers
      ? genericDerivedAsyncImport('LineNumbers', stores.LineNumbers)
      : empty();
  },
  highlightSvelte = (useHlSvelte: boolean) => {
    return useHlSvelte
      ? genericDerivedAsyncImport('HighlightSvelte', stores.HighlightSvelte)
      : empty();
  },
  highlight = () => genericDerivedAsyncImport('Highlight', stores.Highlight);

const getLangType = (lang?: string): Promise<LanguageType<string>> => {
  try {
    // Handle some cases where the name isn't the import name
    switch (lang) {
      case 'c#':
        return import('svelte-highlight/languages/csharp').then((res) => res.csharp);
      case 'c++':
        return import('svelte-highlight/languages/cpp').then((res) => res.cpp);
      case 'html':
        return import('svelte-highlight/languages/xml').then((res) => res.xml);
      case 'sh':
      case 'shell':
        return import('svelte-highlight/languages/bash').then((res) => res.bash);
      case 'svelte':
      case undefined:
        return import('svelte-highlight/languages/markdown').then((res) => res.markdown);
      default:
        return import(`../../../node_modules/svelte-highlight/languages/${lang}.js`).then(
          (res) => res[lang as PropertyKey]
        );
    }
  } catch {
    return import('svelte-highlight/languages/markdown').then((res) => res.markdown);
  }
};

export {
  getLangType,
  highlight as Highlight,
  highlightSvelte as HighlightSvelte,
  lineNumbers as LineNumbers
};
