<script lang="ts">
  import type { ListItemComponentProps } from '@portabletext/svelte';
  import type { Snippet } from 'svelte';

  let {
    portableText,
    children
  }: { portableText: ListItemComponentProps; children: Snippet } = $props();

  const global = $derived(portableText.global);
</script>

<li
  class:mb-2={global.context.bodySize === 'md'}
  class:mb-1={global.context.bodySize === 'base'}
>
  {@render children()}
</li>
