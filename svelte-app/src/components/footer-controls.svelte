<script lang="ts">
  import { navOptions } from '$stores/nav';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '$stores/features';
  import type { PixelIcon } from '@/lib/types';
  import SafeIcon from './safe-icon.svelte';

  const ArrowDown = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/arrow-down.svg').then((Icon) => Icon.default);

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });
</script>

{#if $navOptions.down !== ''}
  <a
    href={$navOptions.down}
    class="hidden md:flex md:ml-40 lg:ml-60 fixed bottom-6 left-8  flex-row items-center select-none"
    on:click={() => $sounds === 'on' && click?.play()}
  >
    <SafeIcon icon={ArrowDown} />
    <p class="font-code text-base w-fit ml-4">
      Continue ({$navOptions.down})
    </p>
  </a>
{/if}
