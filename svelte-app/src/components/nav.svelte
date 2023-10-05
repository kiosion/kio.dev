<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { circInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { afterNavigate } from '$app/navigation';
  import { linkTo } from '$i18n';
  import { BASE_ANIMATION_DURATION, NAV_LINKS } from '$lib/consts';
  import { isDesktop } from '$lib/helpers/responsive';
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
    unsubscribe = isDesktop.subscribe((state) => {
      state && navOpen.set(false);
    });
  });

  afterNavigate(() => (navOpen.set(false), true));

  onDestroy(() => unsubscribe && unsubscribe());
</script>

<div role="none">
  <nav aria-label="Main navigation" role="group">
    <div class="flex w-full flex-row items-center justify-between">
      <div class="flex flex-row items-center justify-start gap-5">
        <MenuToggle class="block md:hidden" />
        <span
          class="pointer-events-none block select-none font-code text-3xl text-accent-light/60 dark:text-accent-dark/60 md:hidden"
          aria-hidden="true">~</span
        >
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
            class="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 transition-opacity"
            class:opacity-0={loaded}
          >
            <Spinner class="pointer-events-none" />
          </span>
        </span>
        <span
          class="pointer-events-none hidden select-none font-code text-3xl text-accent-light/70 dark:text-accent-dark/70 md:block"
          aria-hidden="true">~</span
        >
        <div class="hidden flex-row items-center justify-start gap-5 md:flex">
          {#each NAV_LINKS as link}
            <NavLink {link} />
          {/each}
        </div>
      </div>
      <div class="flex flex-row items-center justify-end gap-4">
        <ThemeToggle />
        <LanguageControls />
      </div>
    </div>
    {#if $navOpen}
      <div
        class="mt-3 flex w-full flex-col items-start justify-start text-2xl"
        transition:slide|local={{
          duration: BASE_ANIMATION_DURATION,
          easing: circInOut
        }}
      >
        {#each NAV_LINKS as link}
          <NavLink {link} mobile />
        {/each}
      </div>
    {/if}
  </nav>
</div>

<style lang="scss">
  @import '../styles/breakpoints';

  div[role='none'] {
    @apply fixed left-4 right-4 top-4 z-10 flex items-center justify-center;
  }

  nav {
    @apply flex w-full max-w-5xl flex-col items-center justify-center rounded-lg border border-dark/40 bg-light/40 px-6 py-4 backdrop-blur-lg transition-[border,background-color];

    &:hover,
    &:focus-visible,
    &:focus-within {
      @apply border-dark/60 bg-light/60;
    }
  }

  @media (min-width: $md) {
    div[role='none'] {
      @apply left-6 right-6;
    }

    nav {
      @apply py-2;
    }
  }

  @media (min-width: $xl) {
    nav {
      @apply max-w-6xl;
    }
  }

  :global(.dark) {
    nav {
      @apply border-light/40 bg-dark/50;

      &:hover,
      &:focus-visible,
      &:focus-within {
        @apply border-light/60 bg-dark/70;
      }
    }
  }
</style>
