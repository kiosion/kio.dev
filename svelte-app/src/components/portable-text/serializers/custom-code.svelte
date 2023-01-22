<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ markType } = portableText);
  $: ({ plainTextContent } = portableText);
</script>

{#if markType === 'code'}
  <code
    class="font-code pt-[0.25rem] pb-[0.35rem] px-[0.35rem] mx-0.5 bg-stone-300 dark:bg-stone-900 rounded transition-all duration-150"
    >{plainTextContent}</code
  >
{:else}
  <slot />
{/if}
