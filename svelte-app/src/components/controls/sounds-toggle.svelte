<script lang="ts">
  import { t } from '$i18n';
  import SFX from '$lib/sfx';
  import Features from '$stores/features';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

  $: CanUseSounds = Features.can('use sounds');
  $: tooltipText = $CanUseSounds ? 'Disable sounds' : 'Enable sounds';
</script>

<Hoverable>
  <Tooltip text={$t(tooltipText)} delay={150} fixed>
    <button
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-violet-400 dark:hover:text-violet-300"
      aria-label={$t(tooltipText)}
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
