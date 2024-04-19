<script lang="ts">
  import type { ListItemComponentProps } from '@portabletext/svelte';

  export let portableText: ListItemComponentProps;

  $: ({ global } = portableText);
</script>

<li
  class:mb-2={global.context.bodySize === 'md'}
  class:mb-1={global.context.bodySize === 'base'}
>
  <slot />
</li>
