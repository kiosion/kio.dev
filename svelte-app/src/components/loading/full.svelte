<script lang="ts">
  import { fade } from 'svelte/transition';

  import { classList } from 'svelte-body';

  import Line from './animations/line.svelte';

  export let theme = 'dark',
    width = '400px',
    phrase: string;
</script>

<svelte:body use:classList={'overflow-y-hidden'} />

<div
  class="fixed left-0 top-0 z-[100] grid h-[100vh] w-[100vw] grid-rows-3 gap-4"
  class:bg-black={theme === 'dark'}
  class:bg-light={theme === 'light'}
  data-test-id="loader-full"
  out:fade={{ duration: 200, delay: 200 }}
>
  <span out:fade={{ duration: 200 }}>
    <Line {theme} {width} transparent />
  </span>
  {#if phrase !== ''}
    <p
      class="w-fit self-center justify-self-center font-mono text-base transition-none {theme ===
      'dark'
        ? 'text-light/80'
        : 'text-dark/80'} row-[3]"
      out:fade={{ duration: 200 }}
    >
      {phrase}
    </p>
  {/if}
</div>
