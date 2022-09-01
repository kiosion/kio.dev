<script lang="ts">
  import { theme } from '$stores/theme';
  import { navOptions, pageHeading } from '$stores/nav';
  import { onMount } from 'svelte';
  import { sounds } from '$stores/features';
  import type UIfx from 'uifx';
  import SafeIcon from './safe-icon.svelte';
  import { fade } from 'svelte/transition';

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });
</script>

<div
  class="z-10 fixed hidden md:block rounded-tl-2xl xl:rounded-tl-3xl top-0 ml-[1px] md:left-40 xl:left-60 right-0 py-6 px-8 bg-slate-100/80 dark:bg-slate-800/80 transition-colors duration-150 backdrop-blur-md"
>
  <div class="flex flex-row justify-between items-start">
    <div class="w-52">
      {#if $navOptions && $navOptions.up !== ''}
        <a
          href={$navOptions.up}
          class="w-fit flex flex-row items-center select-none"
          on:click={() => $sounds === 'on' && click?.play()}
          transition:fade={{ duration: 100 }}
        >
          <SafeIcon icon={'ArrowUp'} />
          <p class="font-code text-base w-fit ml-4">
            Back ({$navOptions.up})
          </p>
        </a>
      {/if}
    </div>
    <div class="-ml-52 -mr-40">
      {#if $pageHeading && $pageHeading !== ''}
        <p
          class="font-code text-lg text-center w-fit md:max-w-[14rem] lg:max-w-[28rem] 2xl:max-w-[50rem] select-none cursor-pointer line-clamp-1"
          aria-label="Scroll to top"
          on:click={() => window?.scrollTo({ top: 0, behavior: 'smooth' })}
          transition:fade={{ duration: 100 }}
        >
          {$pageHeading}
        </p>
      {/if}
    </div>
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
          <SafeIcon icon={'MoonStars'} />
        {:else}
          <SafeIcon icon={'Sun'} />
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
          <SafeIcon icon={'Volume2'} />
        {:else}
          <SafeIcon icon={'VolumeX'} />
        {/if}
      </button>
    </div>
  </div>
</div>
