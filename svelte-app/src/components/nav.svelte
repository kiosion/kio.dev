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
      <div class="flex flex-row items-center justify-start gap-5">
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
          aria-hidden="true">/</span
        >
        <div class="hidden flex-row items-center justify-start gap-5 md:flex" role="menu">
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
    @apply fixed left-0 right-0 top-0 z-10 flex items-center justify-center border-b-2 border-dark/20 bg-light/50 backdrop-blur-lg transition-[border,background-color];

    &:hover,
    &:focus-visible,
    &:focus-within {
      @apply bg-light/60;
    }
  }

  nav {
    @apply flex w-full flex-row items-center justify-between gap-5 px-6 py-3;

    @include media(md) {
      @apply flex py-2;
    }
    @include media(lg) {
      @apply max-w-4xl;
    }
    @include media(xl) {
      @apply max-w-5xl;
    }
    @include media(2xl) {
      @apply max-w-6xl;
    }
  }

  :global(.dark) {
    div[role='none'] {
      @apply border-light/20 bg-black/50;

      &:hover,
      &:focus-visible,
      &:focus-within {
        @apply bg-black/60;
      }
    }
  }
</style>
