<script lang="ts">
  import { config as currentConfig } from '$stores/config';
  import { navOpen, nowPlayingData } from '$stores/navigation';
  import { linkTo } from '$i18n';
  import {
    TOP_LEVEL_ROUTES,
    DEFAULT_BREAKPOINTS,
    BASE_ANIMATION_DURATION
  } from '$lib/consts';
  import { circInOut } from 'svelte/easing';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';
  import { slide } from 'svelte/transition';
  import Breakpoints from 'svelte-breakpoints';
  import NavLink from '$components/nav/nav-link.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SoundsToggle from '$components/controls/sounds-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Icon from '$components/icon.svelte';
  import NewNavLink from '$components/nav/new-nav-link.svelte';
  import NewNavSocial from '$components/nav/new-nav-social.svelte';
  import NowPlayingWidget from '$components/nav/now-playing-widget.svelte';
  import Typewriter from 'typewriter-effect/dist/core';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

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

  const onLogoClick = () => {
    SFX.click.play();
    navOpen.set(false);

    if (currentRouteIsHome) {
      goto(linkTo('/features')).then(() => SFX.ping.play());
    } else {
      goto(linkTo('/'));
    }
  };

  let typewriterName: typeof Typewriter | undefined;

  onMount(() => {
    typewriterName = browser
      ? new Typewriter('#typewriter-name', {
          strings: ['Kiosion'],
          autoStart: false
        })
      : undefined;

    browser &&
      typewriterName
        ?.typeString("Hi! I'm")
        .pauseFor(1000)
        .deleteAll()
        .typeString('Kiosion')
        .start();
  });

  const typeName = () => {
    typewriterName?.deleteAll().typeString('Kiosion').start();
  };

  $: currentRouteIsHome = $page.url.pathname.match(/^\/(?:en|fr)?\/?$/gim);
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <nav
      class="flex my-6 ml-9 w-48 flex-shrink-0 flex-grow flex-col justify-between border-r border-stone-400/50 py-3 dark:border-stone-500/60"
      data-test-id="navBar"
    >
      <div>
        <div
          class="mr-9 border-b border-stone-400/50 pb-5 dark:border-stone-500/60"
        >
          <!-- svelte-ignore a11y-missing-content -->
          <h3
            class="font-heading text-xl font-bold leading-relaxed"
            id="typewriter-name"
            on:mouseenter={() => {
              typeName();
            }}
            on:focusin={() => {
              typeName();
            }}
          />
          <span class="flex flex-row items-center gap-2 font-code text-base">
            <Icon icon="pin" width={18} />
            <p>Halifax, CA</p>
          </span>
        </div>
        <ul class="flex relative flex-col items-start gap-4 pt-5 text-base">
          {#each links as link}
            <NewNavLink {link} />
          {/each}
          <!-- TODO: Slider indicator instance -->
        </ul>
      </div>
      <div class="flex mr-9 flex-col">
        {#if $nowPlayingData}
          <NowPlayingWidget data={$nowPlayingData} />
        {/if}
        <div class="flex flex-row flex-wrap items-center justify-center">
          {#each socials as social}
            <NewNavSocial {social} />
          {/each}
        </div>
      </div>
    </nav>
  </svelte:fragment>
  <svelte:fragment slot="sm">
    <nav class="nav--mobile" data-test-id="navBar">
      <div
        class="flex relative m-4 flex-row flex-wrap items-center justify-between gap-4 px-3"
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
          class="flex mb-[10px] flex-col items-center justify-center gap-3 text-2xl"
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
