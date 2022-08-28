<script lang="ts">
  import Line from './animations/line.svelte';
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
    'Reading the docs',
    'Doing the heavy lifting',
    ':3',
    'Waiting for the eventual heat-death of the universe',
    'Calculating the airspeed velocity of an unladen swallow',
    'Why do they call it oven when you of in the cold food of out hot eat the food'
  ];

  phrase = `${
    phrases[
      Math.floor(seedrandom(`${new Date().getMinutes()}`)() * phrases.length)
    ]
  }`;

  export let theme = 'light';
</script>

<div
  class="absolute w-[100vw] h-[100vh] {theme === 'light'
    ? ' bg-slate-200'
    : ' bg-slate-900'} flex flex-col items-center justify-between z-40"
  data-test-id="loader-full"
  out:fade={{ duration: 200, delay: 400 }}
>
  <div class="w-full h-fit mt-[calc(50vh_-_4px)]" out:fade={{ duration: 200 }}>
    <Line />
  </div>
  {#if phrase !== ''}
    <div class="w-fit max-w-1/2 mx-auto mb-[8vh]" out:fade={{ duration: 200 }}>
      <p
        class="{theme === 'light'
          ? ' text-slate-700'
          : ' text-slate-200'} font-mono text-base"
        data-test-id="loader-full-phrase"
      >
        {phrase}
      </p>
    </div>
  {/if}
</div>
