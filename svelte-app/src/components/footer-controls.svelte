<script lang="ts">
  import { navOptions } from '$stores/nav';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '$stores/features';
  import type { PixelIcon } from '@/lib/types';

  const ArrowDown = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/arrow-down.svg').then((Icon) => Icon.default);

  let ArrowDownIcon: PixelIcon | undefined;

  let click: UIfx;

  onMount(async () => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });

    ArrowDownIcon = await ArrowDown();
  });
</script>

{#if $navOptions.down !== ''}
  <a
    href={$navOptions.down}
    class="hidden md:flex md:ml-40 lg:ml-60 fixed bottom-6 left-8  flex-row items-center select-none"
    on:click={() => $sounds === 'on' && click?.play()}
  >
    {#if ArrowDownIcon}
      <div class="w-[20px]">
        <ArrowDownIcon width="20" />
      </div>
    {/if}
    <p class="font-code text-base w-fit ml-4">
      Continue ({$navOptions.down})
    </p>
  </a>
{/if}
