<script lang="ts">
  import { theme } from '$stores/theme';
  import { fade } from 'svelte/transition';
  import SafeIcon from '../safe-icon.svelte';
</script>

<button
  class="relative w-6 h-6 text-xl hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
  aria-label="Toggle theme"
  data-test-id="theme-toggle"
  on:click={() => theme.set($theme === 'light' ? 'dark' : 'light')}
>
  {#if $theme === 'light'}
    <span
      class="absolute bottom-0 left-0"
      in:fade={{ delay: 100, duration: 200 }}
      out:fade={{ duration: 100 }}
    >
      <SafeIcon icon={'MoonStars'} />
    </span>
  {:else}
    <span
      class="absolute bottom-0 left-0"
      in:fade={{ delay: 100, duration: 200 }}
      out:fade={{ duration: 100 }}
    >
      <SafeIcon icon={'Sun'} />
    </span>
  {/if}
</button>
