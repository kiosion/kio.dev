<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    as = 'section',
    children,
    class: classNames,
    ...rest
  }: {
    /** Element to render as — defaults to `section`. */
    as?: keyof HTMLElementTagNameMap;
    children: Snippet;
  } & HTMLAttributes<HTMLElement> = $props();
</script>

<svelte:element
  this={as}
  class="flex w-full flex-col not-first-of-type:gap-2 first-of-type:mt-2 first-of-type:gap-8{classNames?.length
    ? ' ' + classNames
    : ''}"
  {...rest}
>
  {@render children()}
</svelte:element>
