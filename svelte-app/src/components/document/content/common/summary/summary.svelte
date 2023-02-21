<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Heading from '$components/document/content/common/summary/heading.svelte';
  import Items from '$components/document/content/common/summary/items.svelte';
  import type { Heading as PTHeading } from '$helpers/pt';

  const dispatch = createEventDispatcher();

  export let headings: PTHeading[],
    floating = false,
    expanded = false;

  let hide = false,
    closeButton: HTMLDivElement | undefined;

  $: headingsExist = headings.length > 0;
</script>

<div class:floating class:expanded class:hidden={hide}>
  <Heading
    {floating}
    {headingsExist}
    bind:closeButton
    on:toggle={() => (expanded = !expanded)}
    on:hide={() => dispatch('hide')}
  />
  {#if expanded}
    <Items
      {headings}
      {floating}
      {headingsExist}
      on:toggle={() => (expanded = !expanded)}
    />
  {/if}
</div>

<style lang="scss">
  div {
    @apply rounded-md border border-stone-400/60 bg-stone-300/60 transition-[background-color,box-shadow-color-opacity];
    z-index: 5;

    &:hover {
      @apply border-stone-400/80 bg-stone-300;
    }
  }

  :global(.dark) {
    div {
      @apply border-stone-500/60 bg-stone-900;

      &:hover {
        @apply border-stone-500/80 bg-stone-900/60;
      }
    }
  }
</style>
