<script lang="ts">
  import { onDestroy } from 'svelte';
  import { circInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { linkTo } from '$i18n';
  import { BASE_ANIMATION_DURATION, TOP_LEVEL_ROUTES } from '$lib/consts';
  import { navLinks, navOpen } from '$stores/navigation';

  import LanguageControls from '$components/controls/language-controls.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import NavLink from '$components/nav/nav-link.svelte';
  import NavLinks from '$components/nav/nav-links.svelte';
  import NavSocial from '$components/nav/nav-social.svelte';

  import type { SiteConfig } from '$types';

  interface SocialLink {
    attrs: {
      href: string;
      target: string | undefined;
      rel: string | undefined;
    };
    name: string;
    icon: string;
    iconSize: number;
    iconRotation: number;
  }

  export let config: SiteConfig | undefined;

  const onLogoClick = () => {
    navOpen.set(false);
    goto($linkTo('/'));
  };

  const linkToUnsubscriber = linkTo.subscribe((fn) => {
    navLinks.set(
      TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map((route) => ({
        name: route.name,
        url: fn(route.path),
        active: false,
        hovered: false
      }))
    );
  });

  onDestroy(() => linkToUnsubscriber?.());

  const socials =
    (config?.socialLinks?.map((link) => ({
      attrs: {
        href: $linkTo(link.url),
        target: link.internal ? undefined : '_blank',
        rel: link.rel?.join(' ') || undefined
      },
      name: link.name,
      icon: link.icon,
      iconSize: link.iconSize,
      iconRotation: link.iconRotation
    })) as SocialLink[]) || ([{}] as SocialLink[]);
</script>

<nav
  class="relative my-20 ml-12 hidden w-fit flex-col gap-y-5 rounded-lg border border-dark/40 pb-3 pt-5 transition-[background-color,border-color] focus-within:border-dark/60 focus-within:bg-dark/5 hover:border-dark/60 hover:bg-dark/5 dark:border-light/40 dark:focus-within:border-light/60
  dark:focus-within:bg-dark/30 dark:hover:border-light/60 dark:hover:bg-dark/30 lg:flex"
  aria-label="Main navigation"
  role="group"
  data-test-id="navBar"
>
  <button
    class="focusOutline relative mx-auto w-48 rounded-sm"
    aria-label="Home"
    on:click={onLogoClick}
  >
    <img
      class="h-full px-9 py-4 dark:invert"
      src="/assets/logo-text--short.webp"
      alt="Kiosion"
    />
  </button>
  <div class="block h-[1px] w-full bg-dark/40 dark:bg-light/40" />
  <div class="flex w-56 flex-1 flex-col justify-between">
    <NavLinks />
    <div>
      {#if socials.length}
        <div class="block h-[1px] w-full bg-dark/40 dark:bg-light/40" />
      {/if}
      <div
        class="flex flex-row flex-wrap items-center justify-center gap-x-1 pt-3"
        aria-label="Social links"
        role="menubar"
      >
        {#each socials as social}
          <NavSocial {social} />
        {/each}
      </div>
    </div>
  </div>
</nav>

<nav class="block lg:hidden" data-test-id="navBar">
  <div
    class="relative m-4 flex flex-row flex-wrap items-center justify-between gap-4 px-3"
  >
    <MenuToggle />
    <Hoverable>
      <button
        class="logo-text -mr-6 h-8 transition-[filter] dark:invert"
        data-test-id="nav-logo"
        on:click={() => onLogoClick()}
      >
        <img class="h-full" src="/assets/logo-text--short.webp" alt="Kiosion" />
      </button>
    </Hoverable>
    <div class="align-center flex w-fit flex-row justify-start gap-4 pt-1">
      <ThemeToggle />
    </div>
  </div>
  {#if $navOpen}
    <div
      class="mb-[10px] flex flex-col items-center justify-center gap-3 text-2xl"
      transition:slide|local={{
        duration: BASE_ANIMATION_DURATION,
        easing: circInOut
      }}
    >
      {#each $navLinks as link, index}
        <NavLink {link} {index} mobile />
      {/each}
      <LanguageControls
        class="-mt-2 mb-4 flex flex-row items-center justify-center font-mono text-base text-dark/80 dark:text-light/80"
        forNav
      />
    </div>
  {/if}
</nav>
