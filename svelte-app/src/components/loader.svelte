<script lang="ts">
  import { Diamonds } from 'svelte-loading-spinners';
  import { fly } from 'svelte/transition';

  export let size = '38';
  export let color = '#1E293B';
</script>

<div
  class="absolute bg-slate-100 dark:bg-slate-800 flex items-center justify-center z-40"
  data-test-id="loader"
  out:fly={{ duration: 100, y: 10 }}
>
  <Diamonds {size} {color} />
</div>

<style lang="scss">
  div {
    height: 100vh;
    width: 100vw;
  }
</style>
