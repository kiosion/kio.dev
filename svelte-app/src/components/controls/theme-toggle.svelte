<script lang="ts">
  import { t } from '$i18n';
  import SFX from '$lib/sfx';
  import Settings from '$stores/settings';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import Icon from '../icon.svelte';

  const { theme } = Settings;

  $: tooltipText = $theme === 'light' ? 'Use dark theme' : 'Use light theme';
</script>

<Hoverable>
  <Tooltip text={$t(tooltipText)} delay={150} fixed>
    <button
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-accent-light dark:hover:text-accent-dark"
      aria-label={$t(tooltipText)}
      data-test-id="theme-toggle"
      data-test-state={$theme}
      tabindex="0"
      on:click={() => {
        theme.set($theme === 'light' ? 'dark' : 'light');
        SFX.click.play();
      }}
    >
      <Icon icon={$theme === 'light' ? 'MoonStars' : 'Sun'} />
    </button>
  </Tooltip>
</Hoverable>
