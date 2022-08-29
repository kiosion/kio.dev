<script lang="ts">
  import { navOpen } from '$stores/nav';
  import { fade } from 'svelte/transition';
  import type { PixelIcon } from '$lib/types';
  import SafeIcon from '../safe-icon.svelte';

  const Menu = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/menu.svg').then((Icon) => Icon.default);
  const CloseBox = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/close-box.svg').then((Icon) => Icon.default);
</script>

<button
  class="relative w-6 h-6 text-2xl hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
  aria-label="Toggle nav"
  on:click={() => navOpen.set(!$navOpen)}
>
  {#if $navOpen}
    <span
      class="absolute bottom-0 left-0"
      in:fade={{ delay: 100, duration: 200 }}
      out:fade={{ duration: 100 }}
    >
      <SafeIcon icon={CloseBox} />
    </span>
  {:else}
    <span
      class="absolute bottom-0 left-0"
      in:fade={{ delay: 100, duration: 200 }}
      out:fade={{ duration: 100 }}
    >
      <SafeIcon icon={Menu} />
    </span>
  {/if}
</button>
