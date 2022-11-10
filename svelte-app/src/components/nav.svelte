<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-argument */
  import { slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import ThemeToggle from '$components/toggles/theme-toggle.svelte';
  import MenuToggle from '$components/toggles/menu-toggle.svelte';
  import { navOpen } from '$stores/navigation';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS, TOP_LEVEL_ROUTES } from '$lib/consts';
  import SoundsToggle from '$components/toggles/sounds-toggle.svelte';
  import { linear } from 'svelte/easing';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import LinkIndicator from '$components/nav/link-indicator.svelte';

  const links = TOP_LEVEL_ROUTES.map((route) => ({
    name: route.name,
    url: linkTo(route.path),
    active: false
  })).filter((link) => link.name !== 'Index');

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

  const onLogoClick = () => {
    clicks++;
    navOpen.set(false);
    if (clicks > 3) {
      goto(linkTo('/features'))
        .then(() => {
          SFX.ping.play();
          clicks = 0;
        })
        .catch(() => (clicks = 0));
    } else {
      SFX.click.play();
      goto(linkTo('/')).catch(() => undefined);
      setTimeout(() => (clicks = 0), 1200);
    }
  };
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
                  data-sveltekit-prefetch
                  on:click={() => {
                    navOpen.set(false);
                    SFX.click.play();
                  }}
                >
                  {t(link.name)}
                </a>
                <LinkIndicator {link} />
              </div></Hoverable
            >
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
              on:click={() => SFX.click.play()}
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
                class:active={$page.url.pathname === link.url}
                aria-label={t(link.name)}
                href={link.url}
                preload={link.url}
                data-sveltekit-prefetch
                on:mouseenter={() => (link.active = true)}
                on:mouseleave={() => (link.active = false)}
                on:focus={() => (link.active = true)}
                on:blur={() => (link.active = false)}
                on:click={() => {
                  SFX.click.play();
                  navOpen.set(false);
                }}
              >
                {t(link.name)}
              </a>
              <div
                class="absolute z-0 {$page.url.pathname === link.url ||
                link.active
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
