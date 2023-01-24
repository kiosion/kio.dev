<script lang="ts">
  import { navOptions, pageHeading } from '$stores/navigation';
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import { fade } from 'svelte/transition';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { APP_LANGS, DEFAULT_BREAKPOINTS } from '$lib/consts';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import SoundsToggle from '$components/controls/sounds-toggle.svelte';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import Tooltip from '$components/tooltip.svelte';
  import { page } from '$app/stores';

  let scrollNavHovered = false,
    enHover = false,
    frHover = false;

  export let position: 'bottom' | 'top',
    appBody: HTMLElement | undefined = undefined;

  $: navOption = $navOptions[position === 'bottom' ? 'down' : 'up'];
  $: hasNavOption = navOption !== '' && navOption !== undefined;
  $: actionText = position === 'bottom' ? 'Next' : 'Back';
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <div
      class="page-controls-{position} from-stone-200 dark:from-stone-800 fixed left-36 lg:left-44 xl:left-52 right-0 z-[4] hidden md:block py-6 px-7 bg-transparent transition-colors"
    >
      <div class="flex flex-row justify-between items-start">
        <div class="w-52">
          <Hoverable bind:hovered={scrollNavHovered}>
            {#if hasNavOption}
              <a
                data-sveltekit-preload-data
                data-sveltekit-preload-code
                href={linkTo(navOption)}
                class="w-fit flex flex-row items-center select-none {scrollNavHovered
                  ? `scroll-hover-${position === 'bottom' ? 'down' : 'up'}`
                  : ''} rounded-sm focusOutline"
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
                <p class="font-code text-base w-fit ml-4">
                  {t(actionText)} ({navOption})
                </p>
              </a>
            {:else}
              <div
                class="w-fit flex flex-row items-center select-none cursor-not-allowed"
                role="button"
                aria-disabled="true"
              >
                <Icon
                  icon={position === 'bottom' ? 'ArrowDown' : 'ArrowUp'}
                  classes="text-stone-700 dark:text-stone-100/60"
                />
                <p
                  class="font-code text-base w-fit ml-4 text-stone-700 dark:text-stone-100/60"
                >
                  {t(actionText)}
                </p>
              </div>
            {/if}
          </Hoverable>
        </div>
        {#if position === 'top'}
          <div class="flex flex-1 justify-center">
            {#if $pageHeading && $pageHeading !== ''}
              <Hoverable>
                <Tooltip text={t('Scroll to top')} position="bottom" fixed>
                  <button
                    class="flex flex-row gap-4 items-center font-code text-lg text-center w-fit md:max-w-[14rem] lg:max-w-[30rem] 2xl:max-w-[54rem] select-none cursor-pointer rounded-sm focusOutline drop-shadow-md -translate-x-1/4"
                    aria-label="Scroll to top"
                    on:click={() =>
                      appBody?.scrollTo?.({ top: 0, behavior: 'smooth' })}
                    on:keydown={(e) =>
                      (e.code === 'Enter' || e.code === 'Space') &&
                      appBody?.scrollTo?.({ top: 0, behavior: 'smooth' })}
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
        {:else}
          <div
            class="flex flex-row justify-end items-center gap-1 w-52 font-code text-base"
          >
            <span class="select-none cursor-default">{t('Language')} (</span>
            <Hoverable bind:hovered={enHover}>
              <a
                class="{enHover
                  ? 'underline'
                  : ''} decoration-violet-300 decoration-2 rounded-sm focusOutline-sm"
                aria-label={t('Switch language to {lang}', {
                  lang: APP_LANGS[0]
                })}
                href={linkTo($page.url.pathname, APP_LANGS[0])}
                target="_self"
                role="button"
                tabindex="0"
                on:click={() => SFX.click.play()}
                on:keydown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    SFX.click.play();
                    goto(linkTo($page.url.pathname, APP_LANGS[0])).catch(
                      () => undefined
                    );
                  }
                }}
              >
                {APP_LANGS[0]}
              </a>
            </Hoverable>
            <span class="select-none cursor-default">/</span>
            <Hoverable bind:hovered={frHover}>
              <a
                class="{frHover
                  ? 'underline'
                  : ''} decoration-violet-300 decoration-2 rounded-sm focusOutline-sm"
                aria-label={t('Switch language to {lang}', {
                  lang: APP_LANGS[1]
                })}
                href={linkTo($page.url.pathname, APP_LANGS[1])}
                target="_self"
                role="button"
                tabindex="0"
                on:click={() => SFX.click.play()}
                on:keydown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    SFX.click.play();
                    goto(linkTo($page.url.pathname, APP_LANGS[1])).catch(
                      () => undefined
                    );
                  }
                }}
              >
                {APP_LANGS[1]}
              </a>
            </Hoverable>
            <span class="select-none cursor-default">)</span>
          </div>
        {/if}
      </div>
    </div>
  </svelte:fragment>
</Breakpoints>

<style lang="scss">
  .page-controls {
    &-top {
      top: 0;
      background: linear-gradient(
        to bottom,
        var(--tw-gradient-from) 20%,
        var(--tw-gradient-to) 100%
      );
    }
    &-bottom {
      bottom: 0;
      background: linear-gradient(
        to top,
        var(--tw-gradient-from) 20%,
        var(--tw-gradient-to) 100%
      );
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
