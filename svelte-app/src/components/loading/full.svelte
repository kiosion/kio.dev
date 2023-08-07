<script lang="ts">
  import { fade } from 'svelte/transition';

  import { classList } from 'svelte-body';

  import Line from './animations/line.svelte';

  export let theme = 'dark',
    classes = 'transparent',
    width = '400px',
    phrase: string;
</script>

<svelte:body use:classList={'overflow-y-hidden'} />

<div
  class={`loader-${theme}`}
  data-test-id="loader-full"
  out:fade={{ duration: 200, delay: 200 }}
>
  <span out:fade={{ duration: 200 }}>
    <Line {theme} {width} {classes} />
  </span>
  {#if phrase !== ''}
    <p out:fade={{ duration: 200 }}>
      {phrase}
    </p>
  {/if}
</div>

<style lang="scss">
  div {
    @apply fixed left-0 top-0 z-[100] grid grid-rows-3 gap-4;

    height: 100vh;
    width: 100vw;

    &.loader-dark {
      @apply bg-black;
    }
    &.loader-light {
      @apply bg-light;
    }
  }

  p {
    @apply w-fit self-center justify-self-center font-mono text-base transition-none;
    grid-row: 3;

    .loader-dark & {
      @apply text-light/80;
    }
    .loader-light & {
      @apply text-dark/80;
    }
  }
</style>
