<script lang="ts">
  import BaseToggle from '$components/controls/base-toggle.svelte';
  import MoonSmall from '$components/icons/moon-small.svelte';
  import SunSmall from '$components/icons/sun-small.svelte';
  import { APP_THEMES } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  const { theme, modified } = Settings;
</script>

<BaseToggle
  icon={$theme === APP_THEMES.DARK ? MoonSmall : SunSmall}
  aria-label={$t(`Use ${$theme === APP_THEMES.LIGHT ? 'dark' : 'light'} mode`)}
  options={[
    {
      label: $t('Light'),
      value: APP_THEMES.LIGHT,
      selected: $theme === APP_THEMES.LIGHT
    },
    {
      label: $t('Dark'),
      value: APP_THEMES.DARK,
      selected: $theme === APP_THEMES.DARK
    }
  ]}
  on:click={(e) => {
    modified.set(true);
    theme.set($theme === APP_THEMES.LIGHT ? APP_THEMES.DARK : APP_THEMES.LIGHT);
  }}
/>
