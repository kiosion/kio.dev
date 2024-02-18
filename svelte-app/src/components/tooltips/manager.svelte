<script lang="ts">
  import { tooltips } from '$lib/tooltips';

  import TooltipInner from '$components/tooltips/inner.svelte';

  export let container: HTMLDivElement | undefined = undefined;
</script>

{#each $tooltips.entries() as [_, tooltip]}
  <TooltipInner {...tooltip} {container} />
{/each}
