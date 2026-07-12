<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  const {
    children,
    class: classProp,
    ...anchorProps
  }: { children: Snippet } & HTMLAnchorAttributes = $props();
</script>

<a
  class="hover:decoration-orange-light focus-visible:decoration-orange-light active:decoration-orange-light hover:dark:decoration-orange-dark focus-visible:dark:decoration-orange-dark active:dark:decoration-orange-dark cursor-pointer rounded-xs underline decoration-neutral-200 decoration-2 underline-offset-[3px] opacity-100 transition-[color,text-decoration-color,opacity] hover:opacity-80 focus-visible:opacity-80 active:opacity-60 dark:decoration-neutral-400{classProp?.length
    ? ' ' + classProp
    : ''}"
  {...anchorProps}
>
  {@render children?.()}
</a>
