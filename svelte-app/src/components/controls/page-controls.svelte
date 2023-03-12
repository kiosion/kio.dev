<script lang="ts">
  import { navOptions, pageHeading } from '$stores/navigation';
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import SoundsToggle from '$components/controls/sounds-toggle.svelte';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import Tooltip from '$components/tooltip.svelte';
  import LanguageControls from './language-controls.svelte';

  let scrollNavHovered = false;

  export let position: 'bottom' | 'top',
    appBody: HTMLElement | undefined = undefined;

  $: navOption = $navOptions[position === 'bottom' ? 'down' : 'up'];
  $: hasNavOption = navOption !== '' && navOption !== undefined;
  $: actionText = position === 'bottom' ? 'Next' : 'Back';
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <div class="page-controls-{position}">
      <div class="w-52">
        <Hoverable bind:hovered={scrollNavHovered}>
          {#if hasNavOption}
            <a
              data-sveltekit-preload-data
              data-sveltekit-preload-code
              href={$linkTo(navOption)}
              class="flex w-fit select-none flex-row items-center {scrollNavHovered
                ? `scroll-hover-${position === 'bottom' ? 'down' : 'up'}`
                : ''} focusOutline rounded-sm"
              aria-disabled={!hasNavOption}
              on:click={() => SFX.click.play()}
              on:keydown={(e) => {
                if (e.code === 'Enter' || e.code === 'Space') {
                  SFX.click.play();
                  goto(navOption).catch(() => undefined);
                }
              }}
            >
              <Icon icon={position === 'bottom' ? 'ArrowDown' : 'ArrowUp'} />
              <p class="ml-4 w-fit font-code text-base">
                {$t(actionText)} ({navOption})
              </p>
            </a>
          {:else}
            <div
              class="flex w-fit cursor-not-allowed select-none flex-row items-center"
              role="button"
              aria-disabled="true"
            >
              <Icon
                icon={position === 'bottom' ? 'ArrowDown' : 'ArrowUp'}
                classes="text-stone-500 dark:text-stone-100/60"
              />
              <p
                class="ml-4 w-fit font-code text-base text-stone-500 dark:text-stone-100/60"
              >
                {$t(actionText)}
              </p>
            </div>
          {/if}
        </Hoverable>
      </div>
      {#if position === 'top'}
        <div class="flex flex-1 justify-center">
          {#if $pageHeading && $pageHeading !== ''}
            <Hoverable>
              <Tooltip text={$t('Scroll to top')} position="bottom" fixed>
                <button
                  class="focusOutline flex w-fit cursor-pointer select-none flex-row items-center gap-4 rounded-sm text-center font-code text-lg drop-shadow-md md:max-w-[14rem] lg:max-w-[30rem] 2xl:max-w-[54rem]"
                  aria-label="Scroll to top"
                  on:click={() =>
                    appBody?.scrollTo?.({ top: 0, behavior: 'smooth' })}
                  on:keydown={(e) =>
                    (e.code === 'Enter' || e.code === 'Space') &&
                    appBody?.scrollTo?.({ top: 0, behavior: 'smooth' })}
                >
                  <p
                    class="block w-fit overflow-hidden overflow-ellipsis whitespace-nowrap md:max-w-[10rem] lg:max-w-[30rem] 2xl:max-w-[54rem]"
                  >
                    {$pageHeading}
                  </p>
                </button>
              </Tooltip>
            </Hoverable>
          {/if}
        </div>
        <div class="flex w-40 flex-row items-center justify-end gap-4">
          <ThemeToggle />
          <SoundsToggle />
        </div>
      {:else}
        <LanguageControls
          classNames="flex w-52 flex-row items-center justify-end gap-1 font-code text-base z-[3]"
        />
      {/if}
      <div class="pseudo-bg-shadow" />
    </div>
  </svelte:fragment>
</Breakpoints>

<style lang="scss">
  $colourLight: #f5f5f4;
  $colourDark: #1c1917;
  $boxShadowSpread: 28px 0px 42px 48px;

  .page-controls {
    &-top,
    &-bottom {
      @apply fixed right-0 left-56 z-[3] flex flex-row items-start justify-between py-6 px-7;

      .pseudo-bg-shadow {
        @apply absolute left-0 right-0 z-[2] transition-[box-shadow];

        height: 0px;
        box-shadow: $boxShadowSpread $colourLight;
      }
      div:not(.pseudo-bg-shadow) {
        @apply z-[3];
      }
    }

    &-top {
      top: 0;
      .pseudo-bg-shadow {
        @apply top-0;
      }
    }
    &-bottom {
      bottom: 0;
      .pseudo-bg-shadow {
        @apply bottom-0;
      }
    }
  }

  :global(.dark) {
    .page-controls {
      &-top,
      &-bottom {
        .pseudo-bg-shadow {
          box-shadow: $boxShadowSpread $colourDark;
        }
      }
    }
  }

  @keyframes bounceUp {
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
  @keyframes bounceDown {
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

  :global(.scroll-hover-up svg) {
    animation: bounceUp 2s infinite;
  }
  :global(.scroll-hover-down svg) {
    animation: bounceDown 2s infinite;
  }
</style>
