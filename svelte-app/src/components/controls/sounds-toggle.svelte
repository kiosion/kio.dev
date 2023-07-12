<script lang="ts">
  import { t } from '$i18n';
  import SFX from '$lib/sfx';
  import Settings from '$stores/settings';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

  const { sounds } = Settings;

  $: tooltipText = $sounds ? 'Disable sounds' : 'Enable sounds';
</script>

<Hoverable>
  <Tooltip text={$t(tooltipText)} delay={150} fixed>
    <button
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-accent-light dark:hover:text-accent-dark"
      aria-label={$t(tooltipText)}
      data-test-id="sfx-toggle"
      data-test-state={$sounds ? 'on' : 'off'}
      tabindex="0"
      on:click={() => {
        sounds.set($sounds ? false : true);
        SFX.click.play();
      }}
    >
      {#if $sounds}
        <Icon icon="Volume2" />
      {:else}
        <Icon icon="VolumeX" />
      {/if}
    </button>
  </Tooltip>
</Hoverable>
