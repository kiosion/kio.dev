<script lang="ts">
  import { APP_THEMES } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import Hoverable from '$components/hoverable.svelte';

  const { theme, modified } = Settings;
</script>

<Hoverable let:hovered>
  <button
    class="focus-outline -m-1 px-2 py-1 font-mono text-xs"
    class:bg-neutral-500={hovered && $theme === APP_THEMES.DARK}
    class:text-dark={$theme === APP_THEMES.LIGHT}
    class:bg-orange-light={$theme === APP_THEMES.LIGHT}
    class:hover:bg-orange-dark={$theme === APP_THEMES.LIGHT}
    class:focus-visible:bg-orange-dark={$theme === APP_THEMES.LIGHT}
    aria-label={$t($theme === APP_THEMES.LIGHT ? 'Use dark mode' : 'Use light mode')}
    data-test-id="theme-toggle"
    data-test-state={$theme}
    tabindex="0"
    on:click={() => {
      modified.set(true);
      theme.set($theme === APP_THEMES.LIGHT ? APP_THEMES.DARK : APP_THEMES.LIGHT);
    }}
    type="button"
  >
    [{#if $theme === APP_THEMES.DARK}&nbsp;{:else}x{/if}] {$t('Lights on').toLowerCase()}
  </button>
</Hoverable>
