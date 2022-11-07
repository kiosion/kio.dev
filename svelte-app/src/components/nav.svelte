<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-argument */
  import { slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import ThemeToggle from '$components/toggles/theme-toggle.svelte';
  import MenuToggle from '$components/toggles/menu-toggle.svelte';
  import { navOpen } from '$stores/navigation';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import Features from '$stores/features';
  import { page, navigating } from '$app/stores';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS, APP_LANGS } from '$lib/consts';
  import SoundsToggle from '$components/toggles/sounds-toggle.svelte';
  import { linear } from 'svelte/easing';
  import { t, linkTo } from '$i18n';

  const isLocalized = APP_LANGS.includes($page?.params?.lang);

  const links = [
    { name: 'Blog', url: linkTo('/blog'), active: false },
    { name: 'Work', url: linkTo('/work'), active: false },
    { name: 'About', url: linkTo('/about'), active: false }
  ];

  const socials = [
    {
      attrs: {
        href: 'https://mstdn.social/@kio',
        target: '_blank',
        rel: 'me'
      },
      name: 'Mastodon',
      icon: 'fa-brands:mastodon',
      width: '20px',
      height: '20px'
    },
    {
      attrs: {
        href: 'https://github.com/kiosion',
        target: '_blank',
        rel: 'nofollow'
      },
      name: 'Github',
      icon: 'fa-brands:github',
      width: '19px',
      height: '19px'
    },
    {
      attrs: {
        href: 'https://twitter.com/0xKI0',
        target: '_blank',
        rel: 'nofollow'
      },
      name: 'Twitter',
      icon: 'fa-brands:twitter',
      width: '18px',
      height: '18px'
    },
    {
      attrs: {
        href: 'https://discord.gg/kiosion',
        target: '_blank',
        rel: 'nofollow'
      },
      name: 'Discord',
      icon: 'fa-brands:discord',
      width: '20px',
      height: '20px'
    },
    {
      attrs: {
        href: '/pgp'
      },
      name: 'PGP',
      icon: 'fa:key',
      rotate: '90deg',
      width: '18px',
      height: '18px'
    }
  ] as {
    attrs: Record<string, string>;
    name: string;
    icon: string;
    target?: string;
    rotate?: string;
    width?: string;
    height?: string;
  }[];

  let clicks = 0;

  let click: UIfx;
  let ping: UIfx;

  onMount(() => {
    import('$lib/sfx')
      .then((sfx) => {
        click = sfx.click;
        ping = sfx.ping;
      })
      .catch(() => undefined);
  });

  const onLogoClick = () => {
    clicks++;
    $CanUseSounds && click?.play();
    navOpen.set(false);
    if (clicks > 3) {
      goto(linkTo('/features'))
        .then(() => {
          $CanUseSounds && ping?.play();
          clicks = 0;
        })
        .catch(() => {
          clicks = 0;
        });
      return;
    }
    goto(linkTo('/')).catch(() => undefined);
    setTimeout(() => {
      clicks = 0;
    }, 1200);
  };

  export let segment: string;

  $: CanUseSounds = Features.can('use sounds feature');
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    <nav
      class="py-8 px-4 w-40 xl:w-60 fixed h-screen text-center flex flex-col overflow-y-auto"
      data-test-id="navBar"
    >
      <div class="flex-grow -mt-7 md:-mt-4 click-through">
        <!-- Logo -->
        <Hoverable>
          <button
            class="inline-block -rotate-90 mx-auto my-16 lg:my-20 xl:my-24 w-28 lg:w-32 xl:w-36 logo-text dark:invert transition-[filter]"
            on:click={() => onLogoClick()}
          >
            <img
              class="w-full"
              src="/assets/logo-text--short.webp"
              alt="kio."
            />
          </button>
        </Hoverable>
        <!-- Nav links list -->
        <div
          class="flex text-base flex-col gap-3 justify-center pt-8 items-center"
        >
          {#each links as link}
            <Hoverable bind:hovered={link.active}>
              <div class="relative flex flex-row justify-start items-center">
                <a
                  class="menuTarget z-[1] font-mono font-normal uppercase text-base lg:text-lg"
                  aria-label={t(link.name)}
                  href={link.url}
                  on:click={() => {
                    navOpen.set(false);
                    $CanUseSounds && click?.play();
                  }}
                >
                  {t(link.name)}
                </a>
                <div
                  class="indicator absolute z-0 {segment === link.url ||
                  $navigating?.to?.url?.pathname === link.url ||
                  link.active ||
                  (segment.split('/').length > 1 &&
                    segment
                      .split('/')
                      .indexOf(link.url.slice(isLocalized ? 4 : 1)) > 0)
                    ? 'opacity-100'
                    : 'opacity-0'}  bg-emerald-400 dark:bg-emerald-300 rounded-full {segment ===
                    link.url ||
                  $navigating?.to?.url?.pathname === link.url ||
                  link.active
                    ? 'active'
                    : segment.split('/').length > 1 &&
                      segment
                        .split('/')
                        .indexOf(link.url.slice(isLocalized ? 4 : 1)) > 0 &&
                      'dot'}  transition-opacity ease-in"
                />
              </div>
            </Hoverable>
          {/each}
        </div>
      </div>
      <!-- Social links -->
      <div
        class="text-center text-secondary align-center justify-center pt-8 mx-auto flex flex-col xl:flex-row"
      >
        {#each socials as social}
          <Hoverable>
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="flex align-center justify-center p-2 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150 cursor-pointer"
              aria-label={social.name}
              {...social.attrs}
              on:click={() => $CanUseSounds && click?.play()}
            >
              <Icon
                icon={social.icon}
                rotate={social?.rotate}
                width={social?.width}
                height={social?.height}
              />
            </a>
          </Hoverable>
        {/each}
      </div>
    </nav>
  </svelte:fragment>
  <svelte:fragment slot="sm">
    <nav
      class="fixed w-full text-center flex flex-col bg-slate-200 dark:bg-slate-900 transition-colors pb-[3px] z-10"
      data-test-id="navBar"
    >
      <div class="relative flex flex-col m-4">
        <!-- Logo -->
        <Hoverable>
          <button
            class="mx-auto w-44 logo-text dark:invert transition-[filter]"
            on:click={() => onLogoClick()}
          >
            <img
              class="w-full"
              src="/assets/logo-text.webp"
              alt="kiosion logo"
            />
          </button>
        </Hoverable>
        <!-- Toggle buttons -->
        <div
          class="absolute px-3 top-0 left-0 w-full h-full flex items-center justify-between click-through"
        >
          <MenuToggle />
          <div class="w-fit flex flex-row align-center justify-start gap-4">
            <ThemeToggle />
            <SoundsToggle />
          </div>
        </div>
      </div>
      <!-- Nav dropdown -->
      {#if $navOpen}
        <div
          class="flex text-2xl flex-col gap-3 justify-center items-center mb-[10px]"
          transition:slide|local={{ duration: 150, easing: linear }}
        >
          {#each links as link}
            <div class="relative flex flex-row justify-start items-center">
              <a
                class="nav-link font-mono font-normal uppercase text-base"
                class:active={segment === link.url}
                aria-label={link.name}
                href={link.url}
                preload={link.url}
                on:mouseenter={() => (link.active = true)}
                on:mouseleave={() => (link.active = false)}
                on:focus={() => (link.active = true)}
                on:blur={() => (link.active = false)}
                on:click={() => {
                  navOpen.set(false);
                  $CanUseSounds && click?.play();
                }}
              >
                {link.name}
              </a>
              <div
                class="absolute z-0 {segment === link.url || link.active
                  ? 'w-full'
                  : 'w-0'} h-[2px] bg-emerald-400 dark:bg-emerald-300 transition-[width] ease-in click-through select-none"
              />
            </div>
          {/each}
        </div>
      {/if}
    </nav>
  </svelte:fragment>
</Breakpoints>

<style lang="scss">
  .indicator {
    width: 4px;
    height: 4px;
    transform: translateX(-12px);

    &.dot,
    &:not(.dot):not(.active) {
      animation: 300ms ease slideOut;
    }
    &.active {
      width: 100%;
      height: 2px;
      transform: translateX(0px);
      animation: 300ms ease slideOver;
    }
  }

  @keyframes slideOut {
    from {
      width: 100%;
      height: 2px;
      transform: translateX(0px);
    }
    to {
      width: 4px;
      height: 4px;
      transform: translateX(-12px);
    }
  }
  @keyframes slideOver {
    from {
      width: 2px;
      height: 2px;
      transform: translateX(-12px);
    }
    to {
      width: 100%;
      height: 2px;
      transform: translateX(0px);
    }
  }
</style>
