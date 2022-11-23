<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Heading from '$components/document/content/common/summary/heading.svelte';
  import Items from '$components/document/content/common/summary/items.svelte';
  import type { Heading as PTHeading } from '$helpers/pt';

  const dispatch = createEventDispatcher();

  export let headings: PTHeading[],
    floating = false,
    expanded = false,
    visible = true;

  let hide = false,
    closeButton: HTMLDivElement | undefined;

  $: headingsExist = headings.length > 0;
</script>

<div
  class="{hide && 'hidden'} {!visible && 'opacity-0'} rounded-md {floating
    ? expanded
      ? 'bg-slate-200/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-lg'
      : 'bg-slate-200/60 dark:bg-slate-900/60 backdrop-blur-md shadow-lg'
    : 'bg-slate-200 dark:bg-slate-900'} shadow-slate-300/50 dark:shadow-slate-900/50 z-[5] transition-[background-color,box-shadow,color,opacity]"
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
