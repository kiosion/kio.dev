<script lang="ts">
  import { navOpen } from '$stores/navigation';
  import SafeIcon from '../safe-icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Features from '$stores/features';
  import { onMount } from 'svelte';
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
    aria-label="Toggle navigation"
    data-test-id="nav-toggle"
    on:click={() => {
      navOpen.set(!$navOpen);
      $CanUseSounds && click?.play();
    }}
  >
    {#if $navOpen}
      <SafeIcon icon={'CloseBox'} />
    {:else}
      <SafeIcon icon={'Menu'} />
    {/if}
  </button>
</Hoverable>
