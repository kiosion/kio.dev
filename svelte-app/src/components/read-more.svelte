<script lang="ts">
  import { fly } from 'svelte/transition';
  import Divider from './divider.svelte';
  let show = false;

  const toggle = () => {
    show = !show;
  };
</script>

<div class="relative">
  <p
    class="text-center text-base -mb-2 cursor-pointer"
    on:click={() => toggle()}
    on:keydown={(e) => (e.code === 'Enter' || e.code === 'Space') && toggle()}
  >
    Show more
  </p>
  {#if show}
    <div class="mt-6" in:fly|local out:fly|local>
      <slot />
    </div>
  {/if}
  <Divider />
</div>
