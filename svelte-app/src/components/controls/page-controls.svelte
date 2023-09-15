<script lang="ts">
  import { goto } from '$app/navigation';
  import { linkTo, t } from '$i18n';
  import { navOptions, pageHeading } from '$stores/navigation';

  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import LanguageControls from './language-controls.svelte';

  let scrollNavHovered = false;

  export let position: 'bottom' | 'top',
    appBody: HTMLElement | undefined = undefined;

  $: navOption = $navOptions[position === 'bottom' ? 'down' : 'up'];
  $: hasNavOption = navOption !== '' && navOption !== undefined;
  $: actionText = position === 'bottom' ? 'Next' : 'Back';
</script>

<div
  class="page-controls-{position} absolute left-0 right-0 z-[3] hidden flex-row items-start justify-between px-7 py-6 lg:flex"
  role="group"
  aria-label={position === 'top' ? $t('Top bar controls') : $t('Bottom bar controls')}
>
  <div class="z-[3] w-52">
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
          on:keydown={(e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
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
          class="z-[3] flex w-fit cursor-not-allowed select-none flex-row items-center"
          role="button"
          aria-disabled="true"
        >
          <Icon
            icon={position === 'bottom' ? 'ArrowDown' : 'ArrowUp'}
            class="text-dark/70 dark:text-light/70"
          />
          <p class="ml-4 w-fit font-code text-base text-dark/70 dark:text-light/70">
            {$t(actionText)}
          </p>
        </div>
      {/if}
    </Hoverable>
  </div>
  {#if position === 'top'}
    <div class="z-[3] flex flex-1 justify-center">
      {#if $pageHeading && $pageHeading !== ''}
        <Hoverable>
          <Tooltip text={$t('Scroll to top')} position="bottom" fixed>
            <button
              class="focusOutline flex w-fit max-w-[30rem] cursor-pointer select-none flex-row items-center gap-4 rounded-sm text-center font-code text-lg drop-shadow-md xl:max-w-[42rem]"
              aria-label="Scroll to top"
              on:click={() => appBody?.scrollTo?.({ top: 0, behavior: 'smooth' })}
              on:keydown={(e) =>
                (e.code === 'Enter' || e.code === 'Space') &&
                appBody?.scrollTo?.({ top: 0, behavior: 'smooth' })}
            >
              <p class="block w-fit overflow-hidden overflow-ellipsis whitespace-nowrap">
                {$pageHeading}
              </p>
            </button>
          </Tooltip>
        </Hoverable>
      {/if}
    </div>
    <div class="z-[3] flex w-40 flex-row items-center justify-end gap-4">
      <ThemeToggle />
    </div>
  {:else}
    <LanguageControls
      class="z-[3] flex w-52 flex-row items-center justify-end gap-1 font-code text-base"
    />
  {/if}
  <div class="pseudo-bg-shadow absolute left-0 right-0 z-[2] transition-[box-shadow]" />
</div>

<style lang="scss">
  @import '../../styles/colors';

  $boxShadowSpread: 28px 0px 42px 48px;

  .pseudo-bg-shadow {
    height: 0px;
    box-shadow: $boxShadowSpread $light;
  }

  .page-controls {
    &-top {
      &,
      .pseudo-bg-shadow {
        top: 0;
      }
    }
    &-bottom {
      &,
      .pseudo-bg-shadow {
        bottom: 0;
      }
    }
  }

  :global(.dark) {
    .pseudo-bg-shadow {
      box-shadow: $boxShadowSpread $black;
    }
  }
</style>
