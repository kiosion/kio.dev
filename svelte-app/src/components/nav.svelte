<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { circInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { linkTo } from '$i18n';
  import { BASE_ANIMATION_DURATION, NAV_LINKS } from '$lib/consts';
  import { isDesktop } from '$lib/helpers/responsive';
  import { navOpen } from '$stores/navigation';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import NavLink from '$components/nav/nav-link.svelte';

  import type { Unsubscriber } from 'svelte/store';

  export let loaded = false;

  export const toggle = (vis: boolean) => {
    hideNav = !vis;
  };

  let hovered = false,
    hideNav = false,
    unsubscribe: Unsubscriber;

  onMount(() => {
    unsubscribe = isDesktop.subscribe((state) => {
      state && navOpen.set(false);
    });
  });

  onDestroy(() => unsubscribe && unsubscribe());
</script>

<div
  class="fixed left-4 right-4 top-4 z-10 flex items-center justify-center md:left-6 md:right-6"
  on:click={() => {
    if (hideNav) {
      hideNav = false;
    }
  }}
  on:keydown={() => {
    if (hideNav) {
      hideNav = false;
    }
  }}
  role="none"
>
  <Hoverable setPointer={false} bind:hovered>
    <nav
      class="flex w-full max-w-6xl flex-col items-center justify-center rounded-lg border px-6 py-4 backdrop-blur-lg transition-[background-color,border-color,transform] md:py-2 lg:translate-y-0 {hovered
        ? 'border-dark/60 bg-light/60 dark:border-light/60 dark:bg-dark/70'
        : 'border-dark/40 bg-light/40 dark:border-light/40 dark:bg-dark/50'}"
      class:-translate-y-24={hideNav}
      aria-label="Main navigation"
      role="group"
      data-test-id="navBar"
    >
      <div class="flex w-full flex-row items-center justify-between">
        <div class="flex flex-row items-center justify-start gap-5">
          <MenuToggle class="block md:hidden" />
          <span
            class="block h-[24px] w-[2px] transition-[background-color] md:hidden {hovered
              ? 'bg-accent-light dark:bg-accent-dark'
              : 'bg-accent-light/60 dark:bg-accent-dark/60'}"
          />
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
            class="hidden h-[24px] w-[2px] transition-[background-color] md:block {hovered
              ? 'bg-accent-light dark:bg-accent-dark'
              : 'bg-accent-light/60 dark:bg-accent-dark/60'}"
          />
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
  </Hoverable>
</div>
