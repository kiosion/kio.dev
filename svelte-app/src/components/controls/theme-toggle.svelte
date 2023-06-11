<script lang="ts">
  import { t } from '$i18n';
  import SFX from '$lib/sfx';
  import { theme } from '$stores/theme';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import Icon from '../icon.svelte';

  $: tooltipText = $theme === 'light' ? 'Use dark theme' : 'Use light theme';
</script>

<Hoverable>
  <Tooltip text={$t(tooltipText)} delay={150} fixed>
    <button
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-violet-400 dark:hover:text-violet-300"
      aria-label={$t(tooltipText)}
      data-test-id="theme-toggle"
      data-test-state={$theme}
      tabindex="0"
      on:click={() => {
        theme.set($theme === 'light' ? 'dark' : 'light');
        SFX.click.play();
      }}
    >
      {#if $theme === 'light'}
        <Icon icon={'MoonStars'} />
      {:else}
        <Icon icon={'Sun'} />
      {/if}
    </button>
  </Tooltip>
</Hoverable>
