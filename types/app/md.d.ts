/* Ambient declaration; `declare module` here creates the '*.md'
 * module type.
 */
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
