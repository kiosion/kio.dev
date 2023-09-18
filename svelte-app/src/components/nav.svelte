<script lang="ts">
  import { circInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { linkTo } from '$i18n';
  import { BASE_ANIMATION_DURATION, NAV_LINKS } from '$lib/consts';
  import { navOpen } from '$stores/navigation';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import NavLink from '$components/nav/nav-link.svelte';

  let hovered = false;
</script>

<div class="fixed left-6 right-6 top-4 z-10 flex items-center justify-center">
  <Hoverable bind:hovered>
    <nav
      class="flex w-full max-w-6xl flex-col items-center justify-center rounded-lg border px-6 py-2 backdrop-blur-lg transition-[background-color,border-color] {hovered
        ? 'border-dark/60 bg-light/60 dark:border-light/60 dark:bg-dark/70'
        : 'border-dark/40 bg-light/40 dark:border-light/40 dark:bg-dark/50'}"
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
          <a
            class="focusOutline no-select h-12 w-fit rounded-sm py-3 font-code text-xl font-black leading-none"
            href={$linkTo('/')}
            aria-label="Home"
          >
            kio.dev
          </a>
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
          class="my-2 flex w-full flex-col items-start justify-start gap-y-2 text-2xl"
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
