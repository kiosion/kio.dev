<script lang="ts">
  import { slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import ThemeToggle from '$components/toggles/theme-toggle.svelte';
  import MenuToggle from '$components/toggles/menu-toggle.svelte';
  import { navOpen } from '$stores/nav';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '$stores/features';
  import { navigating } from '$app/stores';

  let links = [
    { name: 'Blog', url: '/blog', hovered: false },
    { name: 'Work', url: '/work', hovered: false },
    { name: 'About', url: '/about', hovered: false }
  ];

  let socials = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/0xKI0',
      icon: 'fa-brands:twitter',
      target: '_blank'
    },
    {
      name: 'Github',
      url: 'https://github.com/kiosion',
      icon: 'fa-brands:github',
      target: '_blank'
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/kiosion',
      icon: 'fa-brands:discord',
      target: '_blank'
    },
    {
      name: 'PGP',
      url: '/pgp',
      icon: 'fa:key',
      rotate: '90deg'
    }
  ];

  let clicks = 0;

  let click: UIfx;
  let ping: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
      ping = sfx.ping;
    });
  });

  const onLogoClick = () => {
    clicks++;
    $sounds === 'on' && click?.play();
    if (clicks > 3) {
      goto('/secret')
        .then(() => {
          $sounds === 'on' && ping?.play();
          clicks = 0;
        })
        .catch(() => {
          clicks = 0;
        });
      return;
    }
    goto('/');
    setTimeout(() => {
      clicks = 0;
    }, 1200);
  };

  export let segment: string;
</script>

<nav
  class="p-4 pt-6 md:py-8 md:px-4 w-full md:w-40 lg:w-60 md:fixed md:h-screen text-center flex flex-col-reverse md:flex-col overflow-y-auto"
  data-test-id="navBar"
>
  <div class="flex-grow -mt-7 md:-mt-4 click-through">
    <button
      class="inline-block md:hidden mx-auto w-1/3 logo-text dark:invert transition-[filter]"
      on:click={() => onLogoClick()}
    >
      <img class="w-full" src="/assets/logo-text.webp" alt="kiosion logo" />
    </button>
    <button
      class="hidden md:inline-block -rotate-90 mx-auto my-16 lg:my-20 xl:my-24 w-28 lg:w-32 xl:w-36 logo-text dark:invert transition-[filter]"
      on:click={() => onLogoClick()}
    >
      <img class="w-full" src="/assets/logo-text--short.webp" alt="kio." />
    </button>
    {#if $navOpen}
      <div
        class="flex md:hidden text-2xl flex-col gap-3 justify-center mt-4 items-center"
        transition:slide|local
      >
        {#each links as link}
          <div class="relative flex flex-row justify-start items-center">
            <a
              class="nav-link font-mono font-normal uppercase text-base lg:text-lg"
              class:active={segment === link.url}
              aria-label={link.name}
              href={link.url}
              on:mouseenter={() => (link.hovered = true)}
              on:mouseleave={() => (link.hovered = false)}
              on:focus={() => (link.hovered = true)}
              on:blur={() => (link.hovered = false)}
              on:click={() => {
                navOpen.set(false);
                $sounds === 'on' && click?.play();
              }}>{link.name}</a
            >
            <div
              class="absolute z-0 {segment === link.url || link.hovered
                ? 'w-full'
                : 'w-0'} h-[2px] bg-emerald-400 dark:bg-emerald-300 transition-[width] ease-in"
            />
          </div>
        {/each}
      </div>
    {/if}
    <div
      class="hidden md:flex text-base flex-col gap-3 justify-center pt-4 items-center"
    >
      {#each links as link}
        <div class="relative flex flex-row justify-start items-center">
          <a
            class="z-[1] font-mono font-normal uppercase text-base lg:text-lg"
            aria-label={link.name}
            href={link.url}
            on:mouseenter={() => (link.hovered = true)}
            on:mouseleave={() => (link.hovered = false)}
            on:focus={() => (link.hovered = true)}
            on:blur={() => (link.hovered = false)}
            on:click={() => {
              navOpen.set(false);
              $sounds === 'on' && click?.play();
            }}
          >
            {link.name}
          </a>
          <div
            class="indicator absolute z-0 {segment === link.url ||
            $navigating?.to.pathname === link.url ||
            link.hovered ||
            (segment.split('/').length > 1 &&
              segment.split('/').indexOf(link.url.slice(1)) > 0)
              ? 'opacity-100'
              : 'opacity-0'}  bg-emerald-400 dark:bg-emerald-300 rounded-full {segment ===
              link.url ||
            $navigating?.to.pathname === link.url ||
            link.hovered
              ? 'active'
              : segment.split('/').length > 1 &&
                segment.split('/').indexOf(link.url.slice(1)) > 0 &&
                'dot'}  transition-opacity ease-in"
          />
        </div>
      {/each}
    </div>
  </div>
  <div
    class="text-center text-secondary align-center justify-center pt-8 mx-auto hidden md:flex md:flex-col lg:flex-row"
  >
    {#each socials as social}
      <a
        class="flex align-center justify-center p-2 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150 cursor-pointer"
        href={social.url}
        aria-label={social.name}
        target={social?.target ? '_blank' : ''}
        on:click={() => $sounds === 'on' && click?.play()}
      >
        <Icon icon={social.icon} rotate={social?.rotate} />
      </a>
    {/each}
  </div>
  <div class="flex md:hidden align-center justify-between px-4 click-through">
    <MenuToggle />
    <ThemeToggle />
  </div>
</nav>

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
