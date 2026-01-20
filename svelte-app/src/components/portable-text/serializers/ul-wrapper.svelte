<script lang="ts">
  import type { ListComponentProps } from '@portabletext/svelte';
  import type { Snippet } from 'svelte';

  let {
    portableText,
    children,
  }: { portableText: ListComponentProps; children: Snippet } = $props();

  const global = $derived(portableText.global);
</script>

<ul
  class="pt-ul ml-6 list-disc transition-[color]"
  class:my-6={global.context.bodySize === 'md'}
  class:my-4={global.context.bodySize === 'base'}
  class:px-6={global.context.documentView}
  class:md:px-10={global.context.documentView}
  class:lg:max-w-[60rem]={global.context.documentView}>
  {@render children()}
</ul>
