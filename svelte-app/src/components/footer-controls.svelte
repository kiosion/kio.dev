<script lang="ts">
  import { navOptions } from '$stores/navigation';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '$stores/features';
  import SafeIcon from './safe-icon.svelte';
  import Hoverable from '$components/hoverable.svelte';

  let click: UIfx;
  let scrollNavHovered = false;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });
</script>

{#if $navOptions.down !== ''}
  <div
    class="z-10 fixed hidden md:block rounded-bl-2xl xl:rounded-tl-3xl bottom-0 ml-[1px] md:left-40 xl:left-60 right-0 py-6 px-8 bg-slate-100/80 dark:bg-slate-800/80 transition-colors duration-150 backdrop-blur-md"
  >
    <div class="flex flex-row justify-between items-start">
      <div class="w-52">
        <Hoverable bind:hovered={scrollNavHovered}>
          <a
            href={$navOptions.down}
            class="w-fit flex flex-row items-center select-none {scrollNavHovered
              ? 'scroll-hover-down'
              : ''}"
            on:click={() => $sounds === 'on' && click?.play()}
          >
            <SafeIcon icon={'ArrowDown'} />
            <p class="font-code text-base w-fit ml-4">
              Continue ({$navOptions.down})
            </p>
          </a>
        </Hoverable>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(3px);
    }
    60% {
      transform: translateY(1.5px);
    }
  }

  :global(.scroll-hover-down svg) {
    animation: bounce 2s infinite;
  }
</style>
