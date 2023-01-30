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

<div
  class="{hide && 'hidden'} rounded-md {floating
    ? expanded
      ? 'bg-stone-300/90 shadow-lg backdrop-blur-lg dark:bg-stone-900/90'
      : 'bg-stone-300/60 shadow-lg backdrop-blur-md dark:bg-stone-900/60'
    : 'bg-stone-300/60 dark:bg-stone-900'} z-[5] border border-stone-400/60 transition-[background-color,box-shadow,color,opacity] hover:border-stone-400/80 hover:bg-stone-300 dark:border-stone-500/60 hover:dark:border-stone-500/80 dark:hover:bg-stone-900/60"
>
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
