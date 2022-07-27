<script lang="ts">
  import { Diamonds } from 'svelte-loading-spinners';
  import { fly } from 'svelte/transition';
</script>

<div
  class="flex items-center justify-center z-40"
  out:fly={{ duration: 100, y: 10 }}
>
  <Diamonds size="38" color="#1E293B" />
</div>

<style lang="scss">
  div {
    height: 100vh;
    width: 100vh;
  }
</style>
