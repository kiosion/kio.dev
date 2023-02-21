<script lang="ts">
  import { config as currentConfig } from '$stores/config';
  import { navLinks, navOpen, nowPlayingData } from '$stores/navigation';
  import { t, linkTo } from '$i18n';
  import {
    TOP_LEVEL_ROUTES,
    DEFAULT_BREAKPOINTS,
    BASE_ANIMATION_DURATION,
    DEFAULT_DESKTOP_BREAKPOINT
  } from '$lib/consts';
  import { circInOut } from 'svelte/easing';
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';
  import { slide } from 'svelte/transition';
  import Breakpoints, { useMediaQuery } from 'svelte-breakpoints';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SoundsToggle from '$components/controls/sounds-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Icon from '$components/icon.svelte';
  import NavSocial from '$components/nav/nav-social.svelte';
  import NowPlayingWidget from '$components/nav/now-playing-widget.svelte';
  import Typewriter from 'typewriter-effect/dist/core';
  import { browser } from '$app/environment';
  import { onDestroy, onMount } from 'svelte';
  import NavLink from '$components/nav/nav-link.svelte';
  import NavLinks from '$components/nav/nav-links.svelte';
  import type { Unsubscriber } from 'svelte/store';
  import type { AuthorDocument } from '$types';

  navLinks.set(
    TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map((route) => ({
      name: route.name,
      url: linkTo(route.path),
      active: false,
      hovered: false
    }))
  );

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

  export let author: AuthorDocument | undefined;

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

  const onLogoClick = () => {
    SFX.click.play();
    navOpen.set(false);
    goto(linkTo('/'));
  };

  let typewriterName: typeof Typewriter | undefined,
    typewriterElement: HTMLHeadingElement;

  const unsubscribers: Unsubscriber[] = [],
    isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT);

  const initTypewriter = () => {
    typewriterName = browser
      ? new Typewriter(typewriterElement, {
          autoStart: false
        })
      : undefined;

    browser &&
      typewriterName
        ?.typeString(t("Hi! I'm"))
        .pauseFor(1000)
        .deleteAll()
        .typeString('Kiosion')
        .start();
  };

  const typeName = () => {
    typewriterName?.deleteAll().typeString('Kiosion').start();
  };

  onMount(() => {
    unsubscribers.push(
      isDesktop.subscribe((value) => {
        if (value) {
          initTypewriter();
        } else {
          typewriterName?.deleteAll();
        }
      })
    );
  });

  onDestroy(() => {
    unsubscribers.forEach((unsubscriber) => unsubscriber());
  });
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <nav class="nav-desktop" data-test-id="navBar">
      <div>
        <div class="nameContainer">
          <!-- svelte-ignore a11y-missing-content -->
          <h3
            on:mouseenter={() => {
              typeName();
            }}
            on:focusin={() => {
              typeName();
            }}
            bind:this={typewriterElement}
          />
          <span class="location-line">
            <Icon icon="pin" width={17} />
            <p>{author?.location}</p>
          </span>
        </div>
        <NavLinks />
      </div>
      <div class="linksContainer">
        {#if $nowPlayingData}
          <NowPlayingWidget data={$nowPlayingData} />
        {/if}
        <div>
          {#each socials as social}
            <NavSocial {social} />
          {/each}
        </div>
      </div>
    </nav>
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
        </div>
      {/if}
    </nav>
  </svelte:fragment>
</Breakpoints>

<style lang="scss">
  .nav-desktop {
    @apply my-6 ml-9 flex w-48 flex-shrink-0 flex-grow flex-col justify-between border-r border-stone-400/50 py-3;

    .nameContainer {
      @apply mr-9 border-b border-stone-400/50 pb-5;

      h3 {
        @apply select-none font-heading text-xl font-bold leading-relaxed;
      }
      .location-line {
        @apply mt-0.5 flex flex-row items-center gap-2 font-code text-base;

        p {
          @apply -mt-0.5;
        }
      }
    }
    .linksContainer {
      @apply mr-9 flex flex-col;

      div {
        @apply flex flex-row flex-wrap items-center justify-center;
      }
    }
  }

  :global(.dark) {
    .nav-desktop,
    .nameContainer {
      @apply border-stone-500/60;
    }
  }
</style>
