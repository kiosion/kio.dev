<script lang="ts">
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { APP_THEMES, BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import Hoverable from '$components/hoverable.svelte';
  import MoonSmall from '$components/icons/moon-small.svelte';
  import SunSmall from '$components/icons/sun-small.svelte';

  const ANIM_DURATION = BASE_ANIMATION_DURATION * 0.9,
    blurInOpts = {
      duration: ANIM_DURATION,
      amount: 12,
      easing: cubicOut,
      delay: ANIM_DURATION * 0.25
    },
    blurOutOpts = {
      duration: ANIM_DURATION,
      amount: 12,
      easing: cubicIn
    };

  const { theme, modified } = Settings;
</script>

<Hoverable let:hovered>
  <button
    class="focus-outline flex-1 rounded-lg bg-neutral-0/75 px-2.5 py-2 text-sm transition-all hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
    aria-label={$t(`Use ${$theme === APP_THEMES.LIGHT ? 'dark' : 'light'} mode`)}
    data-test-id="theme-toggle"
    tabindex="0"
    on:click={(e) => {
      modified.set(true);
      theme.set($theme === APP_THEMES.LIGHT ? APP_THEMES.DARK : APP_THEMES.LIGHT);
    }}
    on:keyup={(e) => {
      if (e.key !== 'Enter') {
        return;
      }

      modified.set(true);
      theme.set($theme === APP_THEMES.LIGHT ? APP_THEMES.DARK : APP_THEMES.LIGHT);
    }}
    type="button"
  >
    {#if hovered}
      <div
        class="mx-auto flex h-fit flex-row items-center justify-start gap-2"
        in:blur={blurInOpts}
        out:blur={blurOutOpts}
      >
        <svelte:component this={$theme === APP_THEMES.LIGHT ? MoonSmall : SunSmall} />
        <span>{$t($theme === APP_THEMES.LIGHT ? 'Dark' : 'Light')}</span>
      </div>
    {:else}
      <div
        class="mx-auto flex h-fit flex-row items-center justify-start gap-2"
        in:blur={blurInOpts}
        out:blur={blurOutOpts}
      >
        <svelte:component this={$theme === APP_THEMES.LIGHT ? SunSmall : MoonSmall} />
        <span>{$t($theme === APP_THEMES.LIGHT ? 'Light' : 'Dark')}</span>
      </div>
    {/if}
  </button>
</Hoverable>

<style lang="scss">
  button {
    display: grid;
  }

  div {
    grid-column: 1/2;
    grid-row: 1/2;
  }
</style>
