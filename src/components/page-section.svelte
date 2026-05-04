<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    children,
    class: classNames,
    ...sectionProps
  }: { children: Snippet } & HTMLAttributes<HTMLElement> = $props();
</script>

<section
  class="flex w-full flex-col not-first-of-type:gap-2 first-of-type:mt-6 first-of-type:gap-8{classNames?.length
    ? ' ' + classNames
    : ''}"
  {...sectionProps}
>
  {@render children()}
</section>
