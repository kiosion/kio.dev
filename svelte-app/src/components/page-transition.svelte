<script lang="ts">
  import { fly } from 'svelte/transition';
  import Features from '$stores/features';
  import { onNav } from '$lib/transitions';

  export let url: string;
  let navDir: 'forward' | 'backward' = 'forward';

  $: url, (navDir = onNav(url));
  $: CanUseReduceMotion = Features.can('use reduce motion feature');
</script>

{#key url}
  {#if $CanUseReduceMotion}
    <div>
      <slot />
    </div>
  {:else}
    <div
      class="grid grid-cols-1 grid-rows-1"
      in:fly={{
        delay: 200,
        duration: 400,
        y: navDir === 'backward' ? -20 : 20
      }}
      out:fly={{ duration: 200, y: navDir === 'backward' ? 20 : -20 }}
    >
      <slot />
    </div>
  {/if}
{/key}

<style lang="scss">
  div > * {
    grid-column: 1;
    grid-row: 1;
  }
</style>
