<script lang="ts">
  import { classList } from 'svelte-body';
  import Line from './animations/line.svelte';
  import { fade } from 'svelte/transition';
  import seedrandom from 'seedrandom';
  import { LOADING_PHRASES } from '$lib/consts';

  export let classes = 'transparent',
    segments = 12,
    width = '400px';

  let phrase = `${
    LOADING_PHRASES[
      Math.floor(
        seedrandom(`${new Date().getMinutes()}`)() * LOADING_PHRASES.length
      )
    ]
  }`;

  export let theme = 'dark';
</script>

<svelte:body use:classList={'overflow-y-hidden'} />

<div
  class="fixed top-0 left-0 h-[100vh] w-[100vw] {theme === 'light'
    ? ' bg-stone-200'
    : ' bg-stone-900'} z-[100] flex flex-col items-center justify-between"
  data-test-id="loader-full"
  out:fade={{ duration: 200, delay: 200 }}
>
  <div class="mt-[calc(50vh_-_4px)] h-fit w-full" out:fade={{ duration: 200 }}>
    <Line {width} {segments} {classes} />
  </div>
  {#if phrase !== ''}
    <div
      class="absolute bottom-[8vh] w-fit max-w-[50%]"
      out:fade={{ duration: 200 }}
    >
      <p
        class="{theme === 'light'
          ? ' text-stone-800'
          : ' text-stone-200'} w-fit font-mono text-base"
        data-test-id="loader-full-phrase"
      >
        {phrase}
      </p>
    </div>
  {/if}
</div>
