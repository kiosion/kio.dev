<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { circInOut, circOut, quadOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { fade, slide } from 'svelte/transition';

  import Breakpoints from 'svelte-breakpoints';

  import { goto } from '$app/navigation';
  import { linkTo } from '$i18n';
  import {
    BASE_ANIMATION_DURATION,
    DEFAULT_BREAKPOINTS,
    TOP_LEVEL_ROUTES
  } from '$lib/consts';
  import SFX from '$lib/sfx';
  import { navLinks, navOpen, nowPlayingData } from '$stores/navigation';

  import LanguageControls from '$components/controls/language-controls.svelte';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import SoundsToggle from '$components/controls/sounds-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import NavLink from '$components/nav/nav-link.svelte';
  import NavLinks from '$components/nav/nav-links.svelte';
  import NavSocial from '$components/nav/nav-social.svelte';
  import NowPlayingWidget from '$components/nav/now-playing-widget.svelte';

  import type { SiteConfig } from '$types';
  import type { Unsubscriber } from 'svelte/store';

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

  const onLogoClick = () => {
    SFX.click.play();
    navOpen.set(false);
    goto($linkTo('/'));
  };

  let linkToUnsubscriber: Unsubscriber;

  export let config: SiteConfig | undefined;

  onMount(
    () =>
      (linkToUnsubscriber = linkTo.subscribe((fn) => {
        navLinks.set(
          TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map((route) => ({
            name: route.name,
            url: fn(route.path),
            active: false,
            hovered: false
          }))
        );
      }))
  );

  onDestroy(() => linkToUnsubscriber?.());

  const feDisplacementScale = tweened(0, {
      duration: BASE_ANIMATION_DURATION * 2,
      easing: quadOut
    }),
    feTurbulenceBaseFreq1 = tweened(2.01, {
      duration: BASE_ANIMATION_DURATION * 3,
      easing: circOut
    }),
    feTurbulenceBaseFreq2 = tweened(0.01, {
      duration: BASE_ANIMATION_DURATION * 3,
      easing: circOut
    });

  const onLogoFocusIn = () => {
      feDisplacementScale.set(80);
      feTurbulenceBaseFreq1.set(2.08);
      feTurbulenceBaseFreq2.set(0.08);
    },
    onLogoFocusOut = () => {
      feDisplacementScale.set(0);
      feTurbulenceBaseFreq1.set(2.01);
      feTurbulenceBaseFreq2.set(0.01);
    };

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

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <nav class="nav-desktop" data-test-id="navBar">
      <div
        class="logo-container relative"
        role="button"
        tabindex="0"
        on:mouseenter={onLogoFocusIn}
        on:mouseleave={onLogoFocusOut}
        on:focusin={onLogoFocusIn}
        on:focusout={onLogoFocusOut}
        on:click={onLogoClick}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === 'Space') {
            onLogoClick();
          }
        }}
      >
        <img src="/assets/logo-text--short.webp" alt="Kiosion" />
      </div>
      <span class="border-line" />
      <div class="nav-inner">
        <NavLinks />
        <div class="links-container">
          {#if $nowPlayingData}
            <div in:fade>
              <NowPlayingWidget data={$nowPlayingData} />
            </div>
          {/if}
          <div class="links-inner">
            {#each socials as social}
              <NavSocial {social} />
            {/each}
          </div>
        </div>
      </div>
    </nav>
    <svg>
      <filter id="distortion">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={`${$feTurbulenceBaseFreq1} ${$feTurbulenceBaseFreq2}`}
          numOctaves="1"
          seed="39257"
          stitchTiles="noStitch"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={`${$feDisplacementScale}`}
          xChannelSelector="R"
          yChannelSelector="B"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
        />
      </filter>
    </svg>
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
            <img class="h-full" src="/assets/logo-text--short.webp" alt="Kiosion" />
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
          <LanguageControls
            classNames="-mt-2 mb-4 flex flex-row items-center justify-center font-mono text-base text-dark/80 dark:text-light/80"
            forNav
          />
        </div>
      {/if}
    </nav>
  </svelte:fragment>
</Breakpoints>

<style lang="scss">
  svg {
    position: absolute;
    width: 0;
    height: 0;
    left: -9999px;
    pointer-events: none;
  }
</style>
