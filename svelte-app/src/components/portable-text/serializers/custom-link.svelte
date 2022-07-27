<script lang="ts">
  import type { MarkProps } from '@portabletext/svelte';

  export let portableText: MarkProps<{
    url?: string;
    newWindow?: boolean;
  }>;

  $: mark = portableText.mark;
  $: newWindow = mark.newWindow || false;
</script>

{#if mark.url}
  <a href={mark.url} target={newWindow ? '_blank' : undefined}><slot /></a>
{:else}
  <slot />
{/if}
