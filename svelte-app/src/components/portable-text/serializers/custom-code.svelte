<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ markType } = portableText);
  $: ({ plainTextContent } = portableText);
</script>

{#if markType === 'code'}
  <code>{plainTextContent}</code>
{:else}
  <slot />
{/if}

<style lang="scss">
  code {
    @apply rounded bg-dark/5 font-code transition-[background-color];

    // Make sure we don't overlap lines due to the padding
    font-size: 0.95rem;
    padding: {
      top: 0.125rem;
      bottom: 0.125rem;
      left: 0.25rem;
      right: 0.25rem;
    }
    margin: {
      left: 0.125rem;
      right: 0.125rem;
    }
  }

  :global(.dark) {
    code {
      @apply bg-light/10;
    }
  }
</style>
