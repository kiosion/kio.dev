<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    children,
    class: className,
    ...h1Props
  }: { children: Snippet } & HTMLAttributes<HTMLElement> = $props();
</script>

<h1
  class="font-display flex max-w-2xl flex-col text-4xl font-semibold tracking-wide md:text-5xl{className?.length
    ? ' ' + className
    : ''}"
  {...h1Props}
>
  {@render children()}
</h1>
