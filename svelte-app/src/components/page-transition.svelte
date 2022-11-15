<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quartIn, quartOut } from 'svelte/easing';
  import Features from '$stores/features';
  import { onNav } from '$helpers/navigation';

  export let url: URL | undefined;

  const dist = 8,
    duration = 200;

  let navDir: 'forward' | 'backward' = 'forward';

  $: ({ pathname } = url || { pathname: '' });
  $: navDir = onNav(pathname);
  $: CanUseReduceMotion = Features.can('use reduce motion feature');
</script>

{#key pathname}
  {#if $CanUseReduceMotion}
    <slot />
  {:else}
    <div
      class="absolute top-0 left-0 w-full h-full"
      in:fly={{
        delay: duration,
        duration: duration * 2,
        easing: quartOut,
        y: navDir === 'backward' ? -dist : dist
      }}
      out:fly={{
        duration,
        easing: quartIn,
        y: navDir === 'backward' ? dist : -dist
      }}
    >
      <slot />
    </div>
  {/if}
{/key}
