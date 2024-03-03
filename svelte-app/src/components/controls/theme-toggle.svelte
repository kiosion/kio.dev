<script lang="ts">
  import { APP_THEMES } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  const { theme } = Settings;
</script>

<Hoverable>
  <Tooltip text={$t($theme === APP_THEMES.LIGHT ? 'Use dark mode' : 'Use light mode')}>
    <button
      class="focus-outline -m-1.5 flex h-6 w-6 items-center justify-center rounded-sm hover:text-accent-light focus-visible:text-accent-light dark:hover:text-accent-dark dark:focus-visible:text-accent-dark"
      aria-label={$t($theme === APP_THEMES.LIGHT ? 'Use dark mode' : 'Use light mode')}
      data-test-id="theme-toggle"
      data-test-state={$theme}
      tabindex="0"
      on:click={() => {
        theme.set($theme === APP_THEMES.LIGHT ? APP_THEMES.DARK : APP_THEMES.LIGHT);
      }}
    >
      {#key $theme}
        <Icon name={$theme === APP_THEMES.LIGHT ? 'MoonStars' : 'Sun'} size={18} />
      {/key}
    </button>
  </Tooltip>
</Hoverable>
