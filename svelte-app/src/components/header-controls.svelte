<script lang="ts">
  import { navOptions, pageHeading } from '$stores/navigation';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { sounds } from '$stores/features';
  import type UIfx from 'uifx';
  import SafeIcon from './safe-icon.svelte';
  import { fade } from 'svelte/transition';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';
  import ThemeToggle from '$components/toggles/theme-toggle.svelte';
  import SoundsToggle from '$components/toggles/sounds-toggle.svelte';

  let click: UIfx;
  let scrollNavHovered = false;

  export let appBody: HTMLElement;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <div
      class="z-10 fixed hidden md:block rounded-tl-2xl xl:rounded-tl-3xl top-0 ml-[1px] md:left-40 xl:left-60 right-0 py-6 px-8 bg-slate-100/80 dark:bg-slate-800/80 transition-colors duration-150 backdrop-blur-md"
    >
      <div class="flex flex-row justify-between items-start">
        <div class="w-52">
          {#if $navOptions && $navOptions.up !== ''}
            <Hoverable bind:hovered={scrollNavHovered}>
              <a
                href={$navOptions.up}
                class="w-fit flex flex-row items-center select-none {scrollNavHovered
                  ? 'scroll-hover-up'
                  : ''}"
                on:click={() => $sounds === 'on' && click?.play()}
                on:keydown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    $sounds === 'on' && click?.play();
                    goto($navOptions.up);
                  }
                }}
                transition:fade={{ duration: 100 }}
              >
                <SafeIcon icon={'ArrowUp'} />
                <p class="font-code text-base w-fit ml-4">
                  Back ({$navOptions.up})
                </p>
              </a>
            </Hoverable>
          {/if}
        </div>
        <div class="-ml-52 -mr-40">
          {#if $pageHeading && $pageHeading !== ''}
            <Hoverable>
              <p
                class="font-code text-lg text-center w-fit md:max-w-[14rem] lg:max-w-[28rem] 2xl:max-w-[50rem] select-none cursor-pointer line-clamp-1"
                aria-label="Scroll to top"
                role="button"
                on:click={() => {
                  appBody.scrollTo({ top: 0, behavior: 'smooth' });
                  $sounds === 'on' && click?.play();
                }}
                on:keydown={(e) => {
                  (e.code === 'Enter' || e.code === 'Space') &&
                    appBody.scrollTo({ top: 0, behavior: 'smooth' });
                  $sounds === 'on' && click?.play();
                }}
                transition:fade={{ duration: 100 }}
              >
                {$pageHeading}
              </p>
            </Hoverable>
          {/if}
        </div>
        <div class="flex flex-row items-center justify-end w-40 gap-4">
          <ThemeToggle />
          <SoundsToggle />
        </div>
      </div>
    </div>
  </svelte:fragment>
</Breakpoints>

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
      transform: translateY(-3px);
    }
    60% {
      transform: translateY(-1.5px);
    }
  }

  :global(.scroll-hover-up svg) {
    animation: bounce 2s infinite;
  }
</style>
