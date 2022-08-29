<script lang="ts">
  import { theme } from '$stores/theme';
  import { navOptions, pageHeading } from '$stores/nav';
  import { onMount } from 'svelte';
  import { sounds } from '$stores/features';
  import type UIfx from 'uifx';
  import type { PixelIcon } from '@/lib/types';

  const ArrowUp = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/arrow-up.svg').then((Icon) => Icon.default);
  const MoonStars = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/moon-stars.svg').then((Icon) => Icon.default);
  const Sun = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/sun.svg').then((Icon) => Icon.default);
  const Volume2 = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/volume-2.svg').then((Icon) => Icon.default);
  const VolumeX = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/volume-x.svg').then((Icon) => Icon.default);

  let ArrowUpIcon: PixelIcon | undefined;
  let MoonStarsIcon: PixelIcon | undefined;
  let SunIcon: PixelIcon | undefined;
  let Volume2Icon: PixelIcon | undefined;
  let VolumeXIcon: PixelIcon | undefined;

  let click: UIfx;

  onMount(async () => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });

    ArrowUpIcon = await ArrowUp();
    MoonStarsIcon = await MoonStars();
    SunIcon = await Sun();
    Volume2Icon = await Volume2();
    VolumeXIcon = await VolumeX();
  });
</script>

<div
  class="z-10 fixed hidden md:block rounded-tl-2xl top-0 ml-[1px] md:left-40 lg:left-60 right-0 py-6 px-8 bg-slate-100/80 dark:bg-slate-800/80 transition-colors duration-150 backdrop-blur-md"
>
  <div class="flex flex-row justify-between items-start">
    {#if $navOptions && $navOptions.up !== ''}
      <div class="w-52">
        <a
          href={$navOptions.up}
          class="w-fit flex flex-row items-center select-none"
          on:click={() => $sounds === 'on' && click?.play()}
        >
          <div class="w-[20px]">
            {#if ArrowUpIcon}
              <ArrowUpIcon width="20" />
            {/if}
          </div>
          <p class="font-code text-base w-fit ml-4">
            Back ({$navOptions.up})
          </p>
        </a>
      </div>
    {:else}
      <div class="w-52" />
    {/if}
    <p
      class="font-code text-lg w-fit select-none -ml-52 -mr-40 cursor-pointer"
      aria-label="Scroll to top"
      on:click={() => window?.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      {$pageHeading}
    </p>
    <div class="flex flex-row items-center justify-end w-40 gap-4">
      <button
        class="flex flex-row items-center justify-end select-none"
        aria-label="Toggle theme"
        data-test-id="theme-toggle"
        tabindex="0"
        on:click={() => {
          theme.set($theme === 'light' ? 'dark' : 'light');
          $sounds === 'on' && click?.play();
        }}
      >
        {#if $theme === 'light'}
          <div class="w-[20px]">
            {#if MoonStarsIcon}
              <MoonStarsIcon width="20" />
            {/if}
          </div>
        {:else}
          <div class="w-[20px]">
            {#if SunIcon}
              <SunIcon width="20" />
            {/if}
          </div>
        {/if}
      </button>
      <button
        class="flex flex-row items-center justify-end select-none"
        aria-label="Toggle sfx"
        data-test-id="sfx-toggle"
        tabindex="0"
        on:click={() => {
          sounds.set($sounds === 'on' ? 'off' : 'on');
          $sounds === 'on' && click?.play();
        }}
      >
        {#if $sounds === 'on'}
          <div class="w-[20px]">
            {#if Volume2Icon}
              <Volume2Icon width="20" />
            {/if}
          </div>
        {:else}
          <div class="w-[20px]">
            {#if VolumeXIcon}
              <VolumeXIcon width="20" />
            {/if}
          </div>
        {/if}
      </button>
    </div>
  </div>
</div>
