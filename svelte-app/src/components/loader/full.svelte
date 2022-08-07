<script lang="ts">
  import { Diamonds } from 'svelte-loading-spinners';
  import { fly } from 'svelte/transition';

  let phrase: string | undefined;

  const phrases = [
    'Do you like my loading animation? :)',
    'Spinning violently around the y-axis',
    'Assembling from source',
    'Hunting for bugs',
    'Dusting the cobwebs',
    'Looking for missing semicolons',
    'Fetching a bigger boat',
    'Reading the docs',
    'Doing the heavy lifting',
    ':3',
    'Proving P=NP',
    'Waiting for the heat-death of the universe',
    'Calculating the airspeed velocity of an unladen swallow'
  ];

  phrase = `${phrases[Math.floor(Math.random() * phrases.length)]}`;

  export let theme = 'light';
  export let size = 38;
  export let error = false;
</script>

<div
  class="absolute{theme === 'light'
    ? ' bg-slate-100'
    : ' bg-slate-800'} flex items-center justify-center z-40"
  data-test-id="loader-full"
  out:fly={{ duration: 200, y: 10 }}
>
  {#if error}
    <p class="text-center text-base">Error loading data.</p>
  {:else}
    <div class="flex flex-col items-center justify-between w-1/2 h-full">
      <div class="w-fit h-fit mt-[49vh]">
        <Diamonds {size} color={theme === 'light' ? '#1E293B' : '#F1F5F9'} />
      </div>
      <p
        class="mb-[10vh]{theme === 'light'
          ? ' text-slate-800'
          : ' text-slate-100'} font-mono"
        id={'loader-full-phrase'}
      >
        {phrase}
      </p>
    </div>
  {/if}
</div>

<style lang="scss">
  div.absolute {
    height: 100vh;
    width: 100vw;
  }
</style>
