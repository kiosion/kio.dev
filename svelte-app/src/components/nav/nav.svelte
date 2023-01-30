<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-argument */
  import { slide } from 'svelte/transition';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import { navOpen } from '$stores/navigation';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import {
    BASE_ANIMATION_DURATION,
    DEFAULT_BREAKPOINTS,
    TOP_LEVEL_ROUTES
  } from '$lib/consts';
  import SoundsToggle from '$components/controls/sounds-toggle.svelte';
  import { circInOut } from 'svelte/easing';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import { config as currentConfig } from '$stores/config';
  import NavLink from '$components/nav/nav-link.svelte';
  import Tooltip from '$components/tooltip.svelte';
  import NavSocial from './nav-social.svelte';

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

  const socials =
    ($currentConfig.data?.socialLinks?.map((link) => ({
      attrs: {
        href: linkTo(link.url),
        target: link.internal ? undefined : '_blank',
        rel: link.rel?.join(' ') || undefined
      },
      name: link.name,
      icon: link.icon,
      iconSize: link.iconSize,
      iconRotation: link.iconRotation
    })) as SocialLink[]) || ([{}] as SocialLink[]);

  const links = TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map(
    (route) => ({
      name: route.name,
      url: linkTo(route.path),
      active: false
    })
  );

  let navHovered = false;

  const onLogoClick = () => {
    SFX.click.play();
    navOpen.set(false);

    if (currentRouteIsHome) {
      goto(linkTo('/features')).then(() => SFX.ping.play());
    } else {
      goto(linkTo('/'));
    }
  };

  $: currentRouteIsHome = $page.url.pathname.match(/^\/(?:en|fr)?\/?$/gim);
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <Hoverable setPointer={false} bind:hovered={navHovered}>
      <nav class="nav--desktop" class:active={navHovered} data-test-id="navBar">
        <div class="click-through -mt-7 flex-grow md:-mt-4">
          <Tooltip text={t('Click me a few times!')} position="right">
            <Hoverable>
              <button
                class="logo-text focusOutline -ml-3 mt-24 mb-[68px] inline-block w-28 rounded-sm transition-[filter] dark:outline-lime-700 dark:invert lg:my-20 lg:ml-0 lg:w-32 xl:my-24 xl:w-36"
                role="menuitem"
                data-test-id="nav-logo"
                on:click={() => onLogoClick()}
              >
                <img
                  class="-rotate-90"
                  src="/assets/logo-text--short.webp"
                  alt="kio."
                />
              </button>
            </Hoverable>
          </Tooltip>
          <div
            class="flex flex-col items-center justify-center gap-3 pt-8 text-base"
          >
            {#each links as link}
              <NavLink {link} />
            {/each}
          </div>
        </div>
        <div
          class="text-secondary align-center mx-auto flex flex-col justify-center pt-8 text-center"
        >
          {#if socials?.length > 0}
            {#each socials as social}
              <NavSocial {social} />
            {/each}
          {/if}
        </div>
      </nav>
    </Hoverable>
  </svelte:fragment>
  <svelte:fragment slot="sm">
    <nav class="nav--mobile" data-test-id="navBar">
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
            <img
              class="h-full"
              src="/assets/logo-text--short.webp"
              alt="kiosion logo"
            />
          </button>
        </Hoverable>
        <div class="align-center flex w-fit flex-row justify-start gap-4 pt-1">
          <ThemeToggle />
          <SoundsToggle />
        </div>
      </div>
      <!-- Nav dropdown -->
      {#if $navOpen}
        <div
          class="mb-[10px] flex flex-col items-center justify-center gap-3 text-2xl"
          transition:slide|local={{
            duration: BASE_ANIMATION_DURATION,
            easing: circInOut
          }}
        >
          {#each links as link}
            <NavLink {link} />
          {/each}
        </div>
      {/if}
    </nav>
  </svelte:fragment>
</Breakpoints>

<style lang="scss">
  .nav--desktop {
    @apply my-4 ml-4 flex w-32 flex-shrink-0 flex-col overflow-x-hidden overflow-y-scroll rounded-3xl border border-stone-400/80 bg-stone-300/60 px-4 py-8 text-center transition-colors lg:w-40 xl:w-48;

    &.active {
      @apply border-stone-400 bg-stone-300;
    }
  }
  .nav--mobile {
    @apply z-10 flex h-fit w-full flex-col bg-stone-300 text-center transition-colors;
  }

  :global(.dark) {
    .nav--desktop {
      @apply border-stone-500/60 bg-stone-900/80;

      &.active {
        @apply border-stone-500/80 bg-stone-900/40;
      }
    }
    .nav--mobile {
      @apply bg-stone-900;
    }
  }
</style>
