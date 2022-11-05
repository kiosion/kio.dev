<script lang="ts">
  import { theme } from '$stores/theme';
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
    aria-label="Toggle theme"
    data-test-id="theme-toggle"
    data-test-state={$theme}
    tabindex="0"
    on:click={() => {
      theme.set($theme === 'light' ? 'dark' : 'light');
      $CanUseSounds && click?.play();
    }}
  >
    {#if $theme === 'light'}
      <SafeIcon icon={'MoonStars'} />
    {:else}
      <SafeIcon icon={'Sun'} />
    {/if}
  </button>
</Hoverable>
