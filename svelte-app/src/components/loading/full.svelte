<script lang="ts">
  import { classList } from 'svelte-body';
  import Line from './animations/line.svelte';
  // import Spinner from './animations/spinner.svelte';
  // import Circle from '$components/loading/animations/circle.svelte';
  import { fade } from 'svelte/transition';
  import seedrandom from 'seedrandom';

  let phrase = '';

  const phrases = [
    'Spinning violently around the y-axis',
    'Assembling from source',
    'Hunting for bugs',
    'Dusting the cobwebs',
    'Looking for missing semicolons',
    'Getting a bigger boat',
    ':3',
    'Waiting for the eventual heat-death of the universe',
    'Calculating the airspeed velocity of an unladen swallow',
    'Why do they call it oven when you of in the cold food of out hot eat the food',
    'Brewing some coffee',
    'Reticulating splines',
    'Translating from English to English',
    'Browsing StackOverflow',
    'Warming up your CPU',
    'Rotating the earth'
  ];

  phrase = `${
    phrases[
      Math.floor(seedrandom(`${new Date().getMinutes()}`)() * phrases.length)
    ]
  }`;

  export let theme = 'dark';
</script>

<svelte:body use:classList={'overflow-y-hidden'} />

<div
  class="fixed top-0 left-0 w-[100vw] h-[100vh] {theme === 'light'
    ? ' bg-gray-200'
    : ' bg-gray-900'} flex flex-col items-center justify-between z-[100]"
  data-test-id="loader-full"
  out:fade={{ duration: 200, delay: 400 }}
>
  <div class="w-full h-fit mt-[calc(50vh_-_4px)]" out:fade={{ duration: 200 }}>
    <Line />
    <div class="mx-auto w-fit">
      <!-- <Spinner /> -->
      <!-- <Circle /> -->
    </div>
  </div>
  {#if phrase !== ''}
    <div
      class="absolute w-fit max-w-1/2 bottom-[8vh]"
      out:fade={{ duration: 200 }}
    >
      <p
        class="{theme === 'light'
          ? ' text-gray-700'
          : ' text-gray-200'} font-mono text-base w-fit"
        data-test-id="loader-full-phrase"
      >
        {phrase}
      </p>
    </div>
  {/if}
</div>
