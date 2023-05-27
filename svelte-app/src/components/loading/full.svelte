<script lang="ts">
  import { fade } from 'svelte/transition';

  import { classList } from 'svelte-body';

  import { LOADING_PHRASES } from '$lib/consts';

  import seedrandom from 'seedrandom';

  import Line from './animations/line.svelte';

  export let classes = 'transparent',
    width = '400px';

  let phrase = `${
    LOADING_PHRASES[
      Math.floor(seedrandom(`${new Date().getMinutes()}`)() * LOADING_PHRASES.length)
    ]
  }`;
</script>

<svelte:body use:classList={'overflow-y-hidden'} />

<div data-test-id="loader-full" out:fade={{ duration: 200, delay: 200 }}>
  <span out:fade={{ duration: 200 }}>
    <Line {width} {classes} />
  </span>
  {#if phrase !== ''}
    <p class="w-fit font-mono text-base text-stone-200" out:fade={{ duration: 200 }}>
      {phrase}
    </p>
  {/if}
</div>

<style lang="scss">
  div {
    @apply fixed top-0 left-0 z-[100] grid grid-rows-3 gap-4 bg-stone-900;

    height: 100vh;
    width: 100vw;
  }

  p {
    @apply self-center justify-self-center;
    grid-row: 3;
  }
</style>
