<script lang="ts">
  import Heading from '$components/document/content/common/summary/heading.svelte';
  import Items from '$components/document/content/common/summary/items.svelte';

  import type { DocumentHeadings } from '$types';

  export let headings: DocumentHeadings[],
    expanded = false;

  $: headingsExist = headings.length > 0;
</script>

<div class:expanded>
  <Heading {headingsExist} on:toggle={() => (expanded = !expanded)} />
  {#if expanded}
    <Items {headings} {headingsExist} on:toggle={() => (expanded = !expanded)} />
  {/if}
</div>

<style lang="scss">
  div {
    @apply rounded-sm border border-dark/40 bg-transparent transition-[background-color,border-color];

    &:hover,
    &.expanded {
      @apply border-dark/60 bg-dark/5;
    }
  }

  :global(.dark) {
    div {
      @apply border-light/40;

      &:hover,
      &.expanded {
        @apply border-light/60 bg-dark/30;
      }
    }
  }
</style>
