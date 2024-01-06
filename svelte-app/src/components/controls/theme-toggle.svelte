<script lang="ts">
  import { t } from '$i18n';
  import Settings from '$stores/settings';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import Icon from '../icon.svelte';

  const { theme } = Settings;

  $: tooltipText = $theme === 'light' ? 'Use dark mode' : 'Use light mode';
</script>

<Hoverable>
  <Tooltip text={$t(tooltipText)} delay={150} fixed>
    <button
      class="focusOutline -m-1.5 flex h-[24px] w-[24px] items-center justify-center rounded-sm hover:text-accent-light dark:hover:text-accent-dark"
      aria-label={$t(tooltipText)}
      data-test-id="theme-toggle"
      data-test-state={$theme}
      tabindex="0"
      on:click={() => {
        theme.set($theme === 'light' ? 'dark' : 'light');
      }}
    >
      {#key $theme}
        <Icon icon={$theme === 'light' ? 'MoonStars' : 'Sun'} width={18} />
      {/key}
    </button>
  </Tooltip>
</Hoverable>
