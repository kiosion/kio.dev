<script lang="ts">
  import { theme } from '@/stores/theme';
  import { navOptions, pageHeading } from '@/stores/menu';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import type UIfx from 'uifx';
  import { sounds } from '@/stores/features';

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
      <a
        href={$navOptions.up}
        class="flex flex-row items-center select-none w-52"
        on:click={() => $sounds === 'on' && click?.play()}
      >
        <Icon icon="akar-icons:arrow-up" />
        <p class="font-code text-base w-fit ml-4" tabindex="0">
          Back ({$navOptions.up})
        </p>
      </a>
    {:else}
      <div class="w-52" />
    {/if}
    <p class="font-code text-lg w-fit select-none -ml-52 -mr-40">
      {$pageHeading}
    </p>
    <div class="flex flex-row items-center justify-end w-40">
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
        <p class="font-code text-base w-fit mr-4">
          {$theme === 'light' ? 'Light' : 'Dark'}
        </p>
        <Icon
          icon="akar-icons:{$theme === 'light' ? 'moon-fill' : 'sun-fill'}"
        />
      </button>
    </div>
  </div>
</div>
