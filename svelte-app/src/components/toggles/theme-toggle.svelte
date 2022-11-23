<script lang="ts">
  import { theme } from '$stores/theme';
  import Icon from '../icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SFX from '$lib/sfx';
</script>

<Hoverable>
  <button
    class="w-[20px] h-[20px] hover:text-emerald-400 dark:hover:text-emerald-300"
    aria-label="Toggle theme"
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
</Hoverable>
