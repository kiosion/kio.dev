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
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-violet-400"
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
