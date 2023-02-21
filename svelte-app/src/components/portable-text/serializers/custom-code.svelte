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
    @apply mx-0.5 rounded bg-stone-300 px-[0.35rem] pt-[0.25rem] pb-[0.35rem] font-code transition-all duration-150;
  }

  :global(.dark) {
    code {
      @apply bg-stone-900;
    }
  }
</style>
