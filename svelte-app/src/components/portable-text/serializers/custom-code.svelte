<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ markType } = portableText);
  $: ({ plainTextContent } = portableText);
</script>

{#if markType === 'code'}
  <code
    class="mx-0.5 rounded bg-stone-300 px-[0.35rem] pt-[0.25rem] pb-[0.35rem] font-code transition-all duration-150 dark:bg-stone-900"
    >{plainTextContent}</code
  >
{:else}
  <slot />
{/if}
