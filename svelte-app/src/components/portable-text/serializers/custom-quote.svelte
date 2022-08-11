<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ value } = portableText);
</script>

<div class="flex flex-1 w-full items-stretch justify-start">
  <div
    class="block w-[2px] bg-slate-500 dark:bg-slate-300 rounded-sm mr-3 opacity-80"
  />
  <span class="block"><slot /></span>
</div>
