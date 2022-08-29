<script lang="ts">
  import { theme } from '$stores/theme';
  import { navOptions, pageHeading } from '$stores/nav';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '$stores/features';
  import ArrowUp from 'pixelarticons/svg/arrow-up.svg';
  import MoonStars from 'pixelarticons/svg/moon-stars.svg';
  import Sun from 'pixelarticons/svg/sun.svg';
  import Volume2 from 'pixelarticons/svg/volume-2.svg';
  import VolumeX from 'pixelarticons/svg/volume-x.svg';

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
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
          <ArrowUp width="20" />
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
          <MoonStars width="20" />
        {:else}
          <Sun width="20" />
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
          <Volume2 width="20" />
        {:else}
          <VolumeX width="20" />
        {/if}
      </button>
    </div>
  </div>
</div>
