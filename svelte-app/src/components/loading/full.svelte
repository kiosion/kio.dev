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
  class="fixed top-0 left-0 w-[100vw] h-[100vh] {theme === 'light'
    ? ' bg-stone-200'
    : ' bg-stone-900'} flex flex-col items-center justify-between z-[100]"
  data-test-id="loader-full"
  out:fade={{ duration: 200, delay: 600 }}
>
  <div class="w-full h-fit mt-[calc(50vh_-_4px)]" out:fade={{ duration: 200 }}>
    <Line {width} {segments} {classes} />
  </div>
  {#if phrase !== ''}
    <div
      class="absolute w-fit max-w-[50%] bottom-[8vh]"
      out:fade={{ duration: 200 }}
    >
      <p
        class="{theme === 'light'
          ? ' text-stone-700'
          : ' text-stone-200'} font-mono text-base w-fit"
        data-test-id="loader-full-phrase"
      >
        {phrase}
      </p>
    </div>
  {/if}
</div>
