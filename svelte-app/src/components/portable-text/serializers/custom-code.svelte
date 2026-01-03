<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ markType } = portableText);
  $: ({ plainTextContent } = portableText);
</script>

{#if markType === 'code'}
  <code
    class="font-code bg-dark/5 dark:bg-light/10 mx-0.5 rounded px-1 py-0.5 transition-[background-color]"
    >{plainTextContent}</code
  >
{:else}
  <slot />
{/if}
