<script lang="ts">
  import { navOptions, pageHeading } from '$stores/navigation';
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import { fade } from 'svelte/transition';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';
  import ThemeToggle from '$components/toggles/theme-toggle.svelte';
  import SoundsToggle from '$components/toggles/sounds-toggle.svelte';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import Tooltip from '$components/tooltip.svelte';

  let scrollNavHovered = false;

  export let appBody: HTMLElement;
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <div
      class="fixed top-0 left-32 lg:left-40 xl:left-60 right-0 z-[5] hidden md:block rounded-tl-3xl py-5 px-7 bg-slate-100/80 dark:bg-slate-800/80 transition-colors backdrop-blur-md"
    >
      <div class="flex flex-row justify-between items-start">
        <div class="w-52">
          {#if $navOptions && $navOptions.up !== ''}
            <Hoverable bind:hovered={scrollNavHovered}>
              <a
                data-sveltekit-preload-data
                data-sveltekit-preload-code
                href={linkTo($navOptions.up)}
                class="w-fit flex flex-row items-center select-none {scrollNavHovered
                  ? 'scroll-hover-up'
                  : ''} rounded-sm focusOutline"
                on:click={() => SFX.click.play()}
                on:keydown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    SFX.click.play();
                    goto($navOptions.up).catch(() => undefined);
                  }
                }}
                transition:fade={{ duration: 100 }}
              >
                <Icon icon={'ArrowUp'} />
                <p class="font-code text-base w-fit ml-4">
                  {t('Back')} ({$navOptions.up})
                </p>
              </a>
            </Hoverable>
          {/if}
        </div>
        <div class="-ml-52 -mr-40">
          {#if $pageHeading && $pageHeading !== ''}
            <Hoverable>
              <Tooltip text={t('Scroll to top')} position="bottom">
                <button
                  class="flex flex-row gap-4 items-center font-code text-lg text-center w-fit md:max-w-[14rem] lg:max-w-[30rem] 2xl:max-w-[54rem] select-none cursor-pointer rounded-sm focusOutline"
                  aria-label="Scroll to top"
                  on:click={() => {
                    SFX.click.play();
                    appBody.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  on:keydown={(e) => {
                    if (e.code === 'Enter' || e.code === 'Space') {
                      SFX.click.play();
                      appBody.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  transition:fade={{ duration: 100 }}
                >
                  <p
                    class="block w-fit md:max-w-[10rem] lg:max-w-[30rem] 2xl:max-w-[54rem] overflow-hidden overflow-ellipsis whitespace-nowrap"
                  >
                    {$pageHeading}
                  </p>
                </button>
              </Tooltip>
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
