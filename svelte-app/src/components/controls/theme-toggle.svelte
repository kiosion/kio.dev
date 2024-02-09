<script lang="ts">
  import { APP_THEMES } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

  const { theme } = Settings;

  $: tooltipText = $theme === APP_THEMES.LIGHT ? 'Use dark mode' : 'Use light mode';
</script>

<Hoverable>
  <Tooltip text={$t(tooltipText)} delay={150} fixed>
    <button
      aria-label={$t(tooltipText)}
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

<style lang="scss">
  @import '@styles/mixins';
  button {
    @apply -m-1.5 flex items-center justify-center rounded-sm;

    height: 24px;
    width: 24px;

    @include focus-state(lg);

    &:hover,
    &:focus-visible {
      @apply text-accent-light;
    }
  }

  :global(.dark) {
    button {
      @include focus-state(lg, dark);

      &:hover,
      &:focus-visible {
        @apply text-accent-dark;
      }
    }
  }
</style>
