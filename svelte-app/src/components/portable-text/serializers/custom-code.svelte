<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ markType } = portableText);
  $: ({ plainTextContent } = portableText);
</script>

{#if markType === 'code'}
  <code
    class="font-code px-1 py-0.5 mx-0.5 bg-slate-200 dark:bg-slate-900 rounded transition-all duration-150"
    >{plainTextContent}</code
  >
{:else}
  <slot />
{/if}
