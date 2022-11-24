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
  import {
    BASE_ANIMATION_DURATION,
    DEFAULT_BREAKPOINTS,
    TOP_LEVEL_ROUTES
  } from '$lib/consts';
  import SoundsToggle from '$components/toggles/sounds-toggle.svelte';
  import { circInOut } from 'svelte/easing';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import { config as currentConfig } from '$stores/config';
  import LinkIndicator from '$components/nav/link-indicator.svelte';

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
    $currentConfig.data?.socialLinks?.map((link) => ({
      attrs: {
        href: link.url,
        target: link.internal ? undefined : '_blank',
        rel: link.rel?.join(' ') || undefined
      },
      name: link.name,
      icon: link.icon,
      iconSize: link.iconSize,
      iconRotation: link.iconRotation
    })) || ([{}] as SocialLink[]);

  const links = TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map(
    (route) => ({
      name: route.name,
      url: linkTo(route.path),
      active: false
    })
  );

  let clicks = 0;

  const onLogoClick = () => {
    clicks++;
    navOpen.set(false);
    if (clicks >= 3) {
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
      class="flex flex-col flex-shrink-0 w-40 h-screen px-4 py-8 overflow-x-hidden overflow-y-auto text-center xl:w-60"
      data-test-id="navBar"
    >
      <div class="flex-grow -mt-7 md:-mt-4 click-through">
        <!-- Logo -->
        <Hoverable>
          <button
            class="inline-block -rotate-90 mx-auto my-16 lg:my-20 xl:my-24 w-28 lg:w-32 xl:w-36 logo-text dark:invert transition-[filter]"
            role="menuitem"
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
          class="flex flex-col items-center justify-center gap-3 pt-8 text-base"
        >
          {#each links as link}
            <Hoverable bind:hovered={link.active}>
              <div class="relative flex flex-row items-center justify-start">
                <a
                  class="menuTarget z-[1] font-mono font-normal uppercase text-base lg:text-lg"
                  aria-label={t(link.name)}
                  href={link.url}
                  role="menuitem"
                  tabindex="0"
                  data-sveltekit-prefetch
                  on:click={() => {
                    SFX.click.play();
                    navOpen.set(false);
                  }}
                  on:keydown={(e) => {
                    if (e.code === 'Enter' || e.code === 'Space') {
                      e.preventDefault();
                      SFX.click.play();
                      navOpen.set(false);
                      goto(link.url).catch(() => undefined);
                    }
                  }}
                >
                  {t(link.name)}
                </a>
                <LinkIndicator {link} />
              </div>
            </Hoverable>
          {/each}
        </div>
      </div>
      <!-- Social links -->
      <div
        class="flex flex-col justify-center pt-8 mx-auto text-center text-secondary align-center xl:flex-row"
      >
        {#if socials?.length > 0}
          {#each socials as social}
            <Hoverable>
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                class="flex justify-center p-2 transition-colors duration-150 cursor-pointer align-center hover:text-emerald-400 dark:hover:text-emerald-300"
                role="menuitem"
                aria-label={social.name}
                {...social.attrs}
                on:click={() => SFX.click.play()}
                on:keydown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    SFX.click.play();
                    goto(social.attrs.href).catch(() => undefined);
                  }
                }}
              >
                <Icon
                  icon={social.icon}
                  rotate={`${social.iconRotation}deg`}
                  width={social?.iconSize}
                  height={social?.iconSize}
                />
              </a>
            </Hoverable>
          {/each}
        {/if}
      </div>
    </nav>
  </svelte:fragment>
  <svelte:fragment slot="sm">
    <nav
      class="h-fit w-full text-center flex flex-col bg-slate-200 dark:bg-slate-900 transition-colors pb-[3px] z-10"
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
          class="absolute top-0 left-0 flex items-center justify-between w-full h-full px-3 click-through"
        >
          <MenuToggle />
          <div class="flex flex-row justify-start gap-4 w-fit align-center">
            <ThemeToggle />
            <SoundsToggle />
          </div>
        </div>
      </div>
      <!-- Nav dropdown -->
      {#if $navOpen}
        <div
          class="flex text-2xl flex-col gap-3 justify-center items-center mb-[10px]"
          transition:slide|local={{
            duration: BASE_ANIMATION_DURATION,
            easing: circInOut
          }}
        >
          {#each links as link}
            <div class="relative flex flex-row items-center justify-start">
              <a
                class="font-mono text-base font-normal uppercase nav-link"
                class:active={$page.url.pathname === link.url}
                aria-label={t(link.name)}
                href={link.url}
                preload={link.url}
                role="menuitem"
                tabindex="0"
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
