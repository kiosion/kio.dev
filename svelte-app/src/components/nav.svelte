<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { afterNavigate } from '$app/navigation';
  import { linkTo } from '$i18n';
  import { NAV_LINKS } from '$lib/consts';
  import { isMobile, isTablet } from '$lib/helpers/responsive';
  import { navOpen } from '$stores/navigation';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import NavLink from '$components/nav/nav-link.svelte';

  import type { Unsubscriber } from 'svelte/store';

  export let loaded = false;

  let unsubscribe: Unsubscriber;

  onMount(() => {
    unsubscribe = isTablet.subscribe((state) => {
      state && navOpen.set(false);
    });
  });

  afterNavigate(() => (navOpen.set(false), true));

  onDestroy(() => unsubscribe && unsubscribe());
</script>

<div role="none">
  <nav aria-label="Main navigation" role="group">
    <MenuToggle class="inline-block md:hidden" />
    {#if $isMobile && $navOpen}
      <div class="flex w-full items-center justify-around">
        {#each NAV_LINKS as link}
          <NavLink {link} mobile />
        {/each}
      </div>
    {:else}
      <div class="flex flex-row items-center justify-start gap-4">
        <span class="relative mt-0.5 h-fit w-fit">
          <a
            class="focusOutline no-select h-12 w-fit rounded-sm py-3 font-code text-xl font-black leading-none transition-[color,opacity]"
            class:opacity-0={!loaded}
            href={$linkTo('/')}
            aria-label="Home"
          >
            kio.dev
          </a>
          <span
            class="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 transition-[color,opacity]"
            class:opacity-0={loaded}
          >
            <Spinner class="pointer-events-none" />
          </span>
        </span>
        <span
          class="pointer-events-none mb-0.5 hidden select-none font-code text-2xl text-accent-light/80 transition-[color] dark:text-accent-dark/80 md:block"
          aria-hidden="true">|</span
        >
        <div class="hidden flex-row items-center justify-start gap-6 md:flex" role="menu">
          {#each NAV_LINKS as link}
            <NavLink {link} />
          {/each}
        </div>
      </div>
      <div class="flex flex-row items-center justify-end gap-4">
        <ThemeToggle />
        <LanguageControls />
      </div>
    {/if}
  </nav>
</div>

<style lang="scss">
  @import '@styles/mixins';

  div[role='none'] {
    @apply fixed left-4 right-4 top-4 z-10 flex items-center justify-center;

    @include media(md) {
      @apply left-6 right-6 top-6;
    }
  }

  nav {
    @apply flex w-full max-w-5xl flex-row items-center justify-between gap-5 rounded-md border border-dark/40 bg-light/40 px-6 py-3 backdrop-blur-lg transition-[border,background-color];

    @include media(md) {
      @apply flex py-2;
    }
    @include media(xl) {
      @apply max-w-6xl;
    }

    &:hover,
    &:focus-visible,
    &:focus-within {
      @apply border-dark/60 bg-light/60;
    }
  }

  :global(.dark) {
    nav {
      @apply border-light/40 bg-black/50;

      &:hover,
      &:focus-visible,
      &:focus-within {
        @apply border-light/60 bg-black/70;
      }
    }
  }
</style>
