<script lang="ts">
  import { Diamonds } from 'svelte-loading-spinners';
  import { fly } from 'svelte/transition';

  export let theme: string;
  export let size = 38;
  export let error: boolean;
</script>

<div
  class="flex items-center justify-center w-full h-full"
  data-test-id="loader-inline"
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
    margin: {
      top: calc(100vh / 4);
    }
  }
</style>
