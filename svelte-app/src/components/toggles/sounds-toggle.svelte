<script lang="ts">
  import Features from '$stores/features';
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

  $: CanUseSounds = Features.can('use sounds feature');
</script>

<Hoverable>
  <button
    class="w-[20px] h-[20px] hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
    aria-label="Toggle sfx"
    data-test-id="sfx-toggle"
    data-test-state={$CanUseSounds ? 'on' : 'off'}
    tabindex="0"
    on:click={() => {
      Features.set('sounds', $CanUseSounds ? false : true);
      $CanUseSounds && click?.play();
    }}
  >
    {#if $CanUseSounds}
      <SafeIcon icon={'Volume2'} />
    {:else}
      <SafeIcon icon={'VolumeX'} />
    {/if}
  </button>
</Hoverable>
