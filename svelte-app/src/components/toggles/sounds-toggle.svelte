<script lang="ts">
  import { sounds } from '$stores/features';
  import { onMount } from 'svelte';
  import SafeIcon from '$components/safe-icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import type UIfx from 'uifx';

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });
</script>

<Hoverable>
  <button
    class="w-[20px] h-[20px] hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
    aria-label="Toggle sfx"
    data-test-id="sfx-toggle"
    data-test-state={$sounds}
    tabindex="0"
    on:click={() => {
      sounds.set($sounds === 'on' ? 'off' : 'on');
      $sounds === 'on' && click?.play();
    }}
  >
    {#if $sounds === 'on'}
      <SafeIcon icon={'Volume2'} />
    {:else}
      <SafeIcon icon={'VolumeX'} />
    {/if}
  </button>
</Hoverable>
