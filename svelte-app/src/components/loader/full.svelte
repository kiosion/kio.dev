<script lang="ts">
  import { Diamonds } from 'svelte-loading-spinners';
  import { fly } from 'svelte/transition';

  export let theme: string;
  export let size = 38;
  export let error = false;
</script>

<div
  class="absolute bg-slate-100 dark:bg-slate-800 flex items-center justify-center z-40"
  data-test-id="loader-full"
  out:fly={{ duration: 100, y: 10 }}
>
  {#if error}
    <p class="text-center text-base">Error loading data.</p>
  {:else}
    <Diamonds {size} color={theme === 'light' ? '#1E293B' : '#F1F5F9'} />
  {/if}
</div>

<style lang="scss">
  div {
    height: 100vh;
    width: 100vw;
  }
</style>
