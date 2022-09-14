<script lang="ts">
  import { Diamonds } from 'svelte-loading-spinners';
  import { fly } from 'svelte/transition';
  import { browser } from '$app/env';

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

  browser &&
    (phrase = `${phrases[Math.floor(Math.random() * phrases.length)]}`);

  export let theme = 'light';
  export let size = 38;
  export let error = false;
</script>

<div
  class="absolute{theme === 'light'
    ? ' bg-slate-200'
    : ' bg-slate-900'} flex items-center justify-center z-40"
  data-test-id="loader-full"
  out:fly={{ duration: 200, y: 10 }}
>
  {#if error}
    <p class="text-center text-base">Error loading data.</p>
  {:else}
    <div class="flex flex-col items-center justify-between w-1/2 h-full">
      <div class="w-fit h-fit mt-[49vh]" data-test-id="loader-spinner">
        <Diamonds {size} color={theme === 'light' ? '#1E293B' : '#F1F5F9'} />
      </div>
      {#if phrase !== ''}
        <div class="mb-[10vh]" in:fly={{ duration: 150, y: -10 }}>
          <p
            class="{theme === 'light'
              ? ' text-slate-800'
              : ' text-slate-100'} font-mono"
            data-test-id="loader-full-phrase"
          >
            {phrase}
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  div.absolute {
    height: 100vh;
    width: 100vw;
  }
</style>
