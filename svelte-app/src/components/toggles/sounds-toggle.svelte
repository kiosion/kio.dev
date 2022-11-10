<script lang="ts">
  import Features from '$stores/features';
  import SafeIcon from '$components/icons/safe-icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SFX from '$lib/sfx';

  $: CanUseSounds = Features.can('use sounds feature');
</script>

<Hoverable>
  <button
    class="w-[20px] h-[20px] hover:text-emerald-400 dark:hover:text-emerald-300"
    aria-label="Toggle sfx"
    data-test-id="sfx-toggle"
    data-test-state={$CanUseSounds ? 'on' : 'off'}
    tabindex="0"
    on:click={() => {
      Features.set('sounds', $CanUseSounds ? false : true);
      SFX.click.play();
    }}
  >
    {#if $CanUseSounds}
      <SafeIcon icon={'Volume2'} />
    {:else}
      <SafeIcon icon={'VolumeX'} />
    {/if}
  </button>
</Hoverable>
