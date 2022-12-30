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
  import NavLink from '$components/nav/nav-link.svelte';
  import Tooltip from '$components/tooltip.svelte';

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
          setTimeout(() => (clicks = 0), 1200);
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
      class="flex flex-col flex-shrink-0 w-32 lg:w-40 h-screen px-4 py-8 overflow-x-hidden overflow-y-auto text-center xl:w-60"
      data-test-id="navBar"
    >
      <div class="flex-grow -mt-7 md:-mt-4 click-through">
        <!-- Logo -->
        <Tooltip text={t('Click me :)')} position="right">
          <Hoverable>
            <button
              class="inline-block -ml-2 lg:ml-0 mt-24 mb-[68px] lg:my-20 xl:my-24 w-28 lg:w-32 xl:w-36 logo-text dark:invert transition-[filter] rounded-sm focusOutline dark:outline-lime-700"
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
        <!-- Nav links list -->
        <div
          class="flex flex-col items-center justify-center gap-3 pt-8 text-base"
        >
          {#each links as link}
            <NavLink {link} />
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
              <Tooltip
                text={`${social.name
                  ?.substring(0, 1)
                  ?.toUpperCase()}${social.name?.substring(1)}`}
                position="right-end"
                delay={400}
              >
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                  class="flex justify-center p-2 transition-colors duration-150 cursor-pointer align-center hover:text-violet-400 dark:hover:text-violet-300 rounded-sm focusOutline-sm"
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
              </Tooltip>
            </Hoverable>
          {/each}
        {/if}
      </div>
    </nav>
  </svelte:fragment>
  <svelte:fragment slot="sm">
    <nav
      class="h-fit w-full text-center flex flex-col bg-gray-200 dark:bg-gray-900 transition-colors z-10"
      data-test-id="navBar"
    >
      <div
        class="relative flex flex-row justify-between items-center m-4 px-3 flex-wrap gap-4"
      >
        <MenuToggle />
        <Hoverable>
          <button
            class="-mr-6 h-8 logo-text dark:invert transition-[filter]"
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
        <div class="flex flex-row justify-start gap-4 w-fit align-center pt-1">
          <ThemeToggle />
          <SoundsToggle />
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
            <NavLink {link} />
          {/each}
        </div>
      {/if}
    </nav>
  </svelte:fragment>
</Breakpoints>
