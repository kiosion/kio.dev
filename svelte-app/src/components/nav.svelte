<script lang="ts">
  import { config as currentConfig } from '$stores/config';
  import { navLinks, navOpen, nowPlayingData } from '$stores/navigation';
  import { linkTo } from '$i18n';
  import {
    TOP_LEVEL_ROUTES,
    DEFAULT_BREAKPOINTS,
    BASE_ANIMATION_DURATION
  } from '$lib/consts';
  import { circInOut, circOut, quadIn, quadOut } from 'svelte/easing';
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';
  import { slide } from 'svelte/transition';
  import Breakpoints from 'svelte-breakpoints';
  import MenuToggle from '$components/controls/menu-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SoundsToggle from '$components/controls/sounds-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import NavSocial from '$components/nav/nav-social.svelte';
  import NowPlayingWidget from '$components/nav/now-playing-widget.svelte';
  import { onDestroy, onMount } from 'svelte';
  import NavLink from '$components/nav/nav-link.svelte';
  import NavLinks from '$components/nav/nav-links.svelte';
  import type { Unsubscriber } from 'svelte/store';
  import LanguageControls from '$components/controls/language-controls.svelte';
  import { browser } from '$app/environment';
  import { tweened } from 'svelte/motion';

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

  // const socials =
  //   ($currentConfig.data?.socialLinks?.map((link) => ({
  //     attrs: {
  //       href: $linkTo(link.url),
  //       target: link.internal ? undefined : '_blank',
  //       rel: link.rel?.join(' ') || undefined
  //     },
  //     name: link.name,
  //     icon: link.icon,
  //     iconSize: link.iconSize,
  //     iconRotation: link.iconRotation
  //   })) as SocialLink[]) || ([{}] as SocialLink[]);

  const onLogoClick = () => {
    SFX.click.play();
    navOpen.set(false);
    goto($linkTo('/'));
  };

  const unsubscribers: Unsubscriber[] = [];

  onMount(() => {
    unsubscribers.push(
      linkTo.subscribe((fn) => {
        navLinks.set(
          TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map((route) => ({
            name: route.name,
            url: fn(route.path),
            active: false,
            hovered: false
          }))
        );
      })
    );
  });

  onDestroy(() => {
    unsubscribers.forEach((unsubscriber) => unsubscriber());
  });

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

  $: socials =
    ($currentConfig.data?.socialLinks?.map((link) => ({
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
            <NowPlayingWidget data={$nowPlayingData} />
          {/if}
          <div>
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
            <img
              class="h-full"
              src="/assets/logo-text--short.webp"
              alt="Kiosion"
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
          <LanguageControls
            classNames="-mt-2 mb-4 flex flex-row items-center justify-center font-mono text-base text-stone-800 dark:text-stone-300"
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

  .nav-desktop {
    @apply my-8 flex w-fit flex-col border-r border-stone-400/50;

    .nav-inner {
      @apply flex w-56 flex-1 flex-col justify-between;
    }

    .logo-container {
      @apply mx-auto -mt-2 mb-5 w-48;

      img {
        @apply h-full py-4 px-9;
        filter: url(#distortion);
      }
    }
    .border-line {
      @apply inline-block bg-stone-400/50;
      height: 1px;
      width: calc(100% + 2.25rem);
    }
    .links-container {
      @apply mx-9 flex flex-col;

      div {
        @apply flex flex-row flex-wrap items-center justify-center;
      }
    }
  }

  :global(.dark) {
    .nav-desktop,
    .border-line {
      @apply border-stone-500/60;
    }
    .logo-container {
      @apply invert;
    }
  }
</style>
