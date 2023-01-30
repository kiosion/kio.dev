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
  <Tooltip text={t('Toggle sound effects')} fixed>
    <button
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-violet-400"
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
