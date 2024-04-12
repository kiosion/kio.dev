<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ global } = portableText);
</script>

<div
  class="flex w-full flex-1 items-stretch justify-start transition-[background-color,color]"
  class:px-6={global.context.documentView}
  class:md:px-10={global.context.documentView}
>
  <div class="mr-3 block w-[2px] rounded-sm bg-dark/40 opacity-80 dark:bg-light/40" />
  <span class="block flex-grow"><slot /></span>
</div>
