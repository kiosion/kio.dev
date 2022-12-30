<script lang="ts">
  import { theme } from '$stores/theme';
  import Icon from '../icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SFX from '$lib/sfx';
  import { t } from '$i18n';
  import Tooltip from '$components/tooltip.svelte';
</script>

<Hoverable>
  <Tooltip text={t('Toggle theme')} fixed>
    <button
      class="w-[20px] h-[20px] hover:text-violet-400 dark:hover:text-violet-300 rounded-sm focusOutline"
      aria-label={t('Toggle theme')}
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
