<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ markType } = portableText);
  $: ({ plainTextContent } = portableText);
</script>

{#if markType === 'code'}
  <code
    class="mx-0.5 rounded bg-dark/5 px-1 py-0.5 font-code text-[0.95rem] transition-[background-color] dark:bg-light/10"
    >{plainTextContent}</code
  >
{:else}
  <slot />
{/if}
