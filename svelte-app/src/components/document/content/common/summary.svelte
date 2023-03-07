<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Heading from '$components/document/content/common/summary/heading.svelte';
  import Items from '$components/document/content/common/summary/items.svelte';
  import type { Heading as PTHeading } from '$helpers/pt';

  const dispatch = createEventDispatcher();

  export let headings: PTHeading[],
    expanded = false;

  let hide = false,
    closeButton: HTMLDivElement | undefined;

  $: headingsExist = headings.length > 0;
</script>

<div class:expanded class:hidden={hide}>
  <Heading
    {headingsExist}
    bind:closeButton
    on:toggle={() => (expanded = !expanded)}
    on:hide={() => dispatch('hide')}
  />
  {#if expanded}
    <Items
      {headings}
      {headingsExist}
      on:toggle={() => (expanded = !expanded)}
    />
  {/if}
</div>

<style lang="scss">
  div {
    @apply rounded-md border border-stone-400/60 bg-stone-200/40 transition-[background-color,box-shadow,color,opacity];
    z-index: 5;

    &:hover,
    &.expanded {
      @apply border-stone-400/80 bg-stone-200/80;
    }
  }

  :global(.dark) {
    div {
      @apply border-stone-500/60 bg-stone-900;

      &:hover,
      &.expanded {
        @apply border-stone-500/80 bg-stone-800/40;
      }
    }
  }
</style>
