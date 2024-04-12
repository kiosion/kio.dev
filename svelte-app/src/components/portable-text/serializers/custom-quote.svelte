<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value: _value } = portableText);
</script>

<div
  class="flex w-full flex-1 items-stretch justify-start px-6 transition-[background-color,color] md:px-10"
>
  <div class="mr-3 block w-[2px] rounded-sm bg-dark/40 opacity-80 dark:bg-light/40" />
  <span class="block flex-grow"><slot /></span>
</div>
