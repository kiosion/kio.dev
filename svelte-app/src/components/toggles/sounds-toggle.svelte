<script lang="ts">
  import Features from '$stores/features';
  import Icon from '$components/icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SFX from '$lib/sfx';
  import { t } from '$i18n';
  import Tooltip from '$components/tooltip.svelte';

  $: CanUseSounds = Features.can('use sounds');
</script>

<Hoverable>
  <Tooltip text={t('Toggle sound effects')} position="bottom">
    <button
      class="w-[20px] h-[20px] hover:text-emerald-400 dark:hover:text-emerald-300 rounded-sm focusOutline"
      aria-label={t('Toggle sound effects')}
      data-test-id="sfx-toggle"
      data-test-state={$CanUseSounds ? 'on' : 'off'}
      tabindex="0"
      on:click={() => {
        Features.set('use sounds', $CanUseSounds ? false : true);
        SFX.click.play();
      }}
    >
      {#if $CanUseSounds}
        <Icon icon={'Volume2'} />
      {:else}
        <Icon icon={'VolumeX'} />
      {/if}
    </button>
  </Tooltip>
</Hoverable>
