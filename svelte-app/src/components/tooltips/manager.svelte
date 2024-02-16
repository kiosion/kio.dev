<script lang="ts">
  import { tooltips } from '$lib/tooltips';

  import TooltipInner from '$components/tooltips/inner.svelte';
</script>

{#each $tooltips.entries() as [_, tooltip]}
  <TooltipInner {...tooltip} />
{/each}
