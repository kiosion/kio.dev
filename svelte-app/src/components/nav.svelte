<script lang="ts">
  import { circInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { linkTo } from '$i18n';
  import { BASE_ANIMATION_DURATION, TOP_LEVEL_ROUTES } from '$lib/consts';
  import { navOpen } from '$stores/navigation';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import NavLink from '$components/nav/nav-link.svelte';

  const navLinks = TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map((route) => ({
    name: route.name,
    url: route.path
  }));
</script>

<div class="fixed left-6 right-6 top-4 z-10 flex items-center justify-center">
  <nav
    class="flex w-full max-w-6xl flex-col items-center justify-center rounded-lg border border-dark/40 bg-light/40 px-6 py-2 backdrop-blur-lg transition-[background-color,border-color] hover:border-dark/60 hover:bg-light/60
    focus-visible:border-dark/60 focus-visible:bg-light/60 dark:border-light/40 dark:bg-dark/50 dark:hover:border-light/60 dark:hover:bg-dark/70 dark:focus-visible:border-light/60 dark:focus-visible:bg-dark/70"
    aria-label="Main navigation"
    role="group"
    data-test-id="navBar"
  >
    <div class="flex w-full flex-row items-center justify-between">
      <div class="hidden flex-row items-center justify-start gap-5 md:flex">
        <a
          class="focusOutline no-select h-12 w-fit rounded-sm py-3 font-code text-xl font-black leading-none"
          href={$linkTo('/')}
          aria-label="Home"
        >
          kio.dev
        </a>
        <span class="block h-[24px] w-[2px] bg-accent-light/60 dark:bg-accent-dark/60" />
        <div class="flex flex-row items-center justify-start gap-5">
          {#each navLinks as link}
            <NavLink {link} />
          {/each}
        </div>
      </div>
      <div class="relative flex flex-row items-center justify-start gap-4 md:hidden">
        <MenuToggle />
        <span class="block h-[24px] w-[2px] bg-accent-light/60 dark:bg-accent-dark/60" />
        <a
          class="focusOutline no-select h-12 w-fit rounded-sm py-3 font-code text-xl font-black leading-none"
          href={$linkTo('/')}
          aria-label="Home"
          on:click={() => {
            navOpen.set(false);
          }}
        >
          kio.dev
        </a>
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
        {#each navLinks as link}
          <NavLink {link} mobile />
        {/each}
      </div>
    {/if}
  </nav>
</div>
