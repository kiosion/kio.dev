import { SvelteComponent } from 'svelte';

import Logger from '$lib/logger';

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

const components = {
  LineNumbers: undefined,
  HighlightSvelte: undefined,
  Highlight: undefined
} as {
  LineNumbers: Promise<LineNumbers | Error | undefined> | undefined;
  HighlightSvelte: Promise<HighlightSvelte | Error | undefined> | undefined;
  Highlight: Promise<Highlight | Error | undefined> | undefined;
};

export type ResolvedComponentType<K extends keyof typeof components> = Exclude<
  NonNullable<Awaited<NonNullable<(typeof components)[K]>>>,
  Error
>;

export const genericAsyncImport = <K extends keyof typeof components>(name: K) =>
  components[name]
    ? components[name]!
    : ((components[name] = import(`../../../node_modules/svelte-highlight/${name}.svelte`)
        .then((module) => {
          return module?.default || new Error(`No default export for ${name}`);
        })
        .catch((e) => {
          Logger.error(`Error loading ${name} code-block component`, e);
          return e instanceof Error ? e : new Error(e);
        }) as unknown as (typeof components)[K]),
      components[name]!);

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

export { getLangType };
