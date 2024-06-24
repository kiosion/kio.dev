<script lang="ts">
  import { APP_THEMES } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import Hoverable from '$components/hoverable.svelte';

  const { theme, modified } = Settings;
</script>

<Hoverable let:hovered>
  <button
    class="focus-outline -m-1 rounded-xs px-2 py-1 font-mono text-xs text-dark hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:text-light dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600"
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
    [{#if $theme === APP_THEMES.DARK}dark{:else}light{/if}]<span
      class="hidden md:inline-block">&nbsp;{$t('Theme').toLowerCase()}</span
    >
  </button>
</Hoverable>
