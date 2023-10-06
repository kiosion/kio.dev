<script lang="ts">
  import { circIn, circOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';

  import { t } from '$i18n';
  import { summaryContents, summaryOffset } from '$lib/summary';

  import Summary from '$components/document/content/common/summary.svelte';

  export let element: HTMLDivElement;

  $: headings = $summaryContents?.length ? $summaryContents : [];
</script>

<div
  in:fade={{ duration: 300, delay: 50, easing: circOut }}
  out:fade={{ duration: 200, easing: circIn }}
  bind:this={element}
  style="margin-top: {$summaryOffset + 27}px;"
>
  <h1>{$t('Table of Contents')}</h1>
  <span />
  <Summary {headings} />
</div>

<style lang="scss">
  div {
    @apply sticky left-0 top-0 h-fit w-72 overflow-clip pl-8 pt-20;
  }

  h1 {
    @apply mt-2 w-full font-display text-lg font-bold transition-[color];

    margin-bottom: 19px;
  }

  span {
    @apply my-3 block w-full bg-dark/40 transition-[background-color];

    height: 1px;
    max-width: 75%;
  }

  :global(.dark) {
    span {
      @apply bg-light/40;
    }
  }
</style>
