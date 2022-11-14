<script lang="ts">
  import { fly } from 'svelte/transition';
  import Features from '$stores/features';
  import { onNav } from '$helpers/navigation';

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
      class="absolute top-0 left-0 w-full h-full"
      in:fly={{
        delay: 200,
        duration: 400,
        y: navDir === 'backward' ? -10 : 10
      }}
      out:fly={{ duration: 200, y: navDir === 'backward' ? 10 : -10 }}
    >
      <slot />
    </div>
  {/if}
{/key}
