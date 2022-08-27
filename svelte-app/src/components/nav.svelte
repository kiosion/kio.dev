<script lang="ts">
  import { slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import ThemeToggle from '@/components/toggles/theme-toggle.svelte';
  import MenuToggle from '@/components/toggles/menu-toggle.svelte';
  import { menuOpen } from '@/stores/menu';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '@/stores/features';

  let links = [
    { name: 'Blog', url: '/blog' },
    { name: 'Work', url: '/work' },
    { name: 'About', url: '/about' }
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
    if (clicks > 3) {
      $sounds === 'on' && ping?.play();
      goto('/secret')
        .then(() => {
          clicks = 0;
        })
        .catch(() => {
          clicks = 0;
        });
      return;
    }
    $sounds === 'on' && click?.play();
    goto('/');
    setTimeout(() => {
      clicks = 0;
    }, 2000);
  };

  export let segment: string;
  export let hovered: boolean;
</script>

<nav
  class="p-4 pt-6 md:py-8 md:px-4 w-full md:w-40 lg:w-60 md:fixed md:h-screen text-center flex flex-col-reverse md:flex-col overflow-y-auto"
  data-test-id="navBar"
  on:mouseover={() => (hovered = true)}
  on:focus={() => (hovered = true)}
  on:mouseout={() => (hovered = false)}
  on:blur={() => (hovered = false)}
>
  <div class="flex-grow -mt-7 md:-mt-4 click-through">
    <button
      class="inline-block md:hidden mx-auto w-1/3 logo-text"
      on:click={() => onLogoClick()}
    >
      <img class="w-full" src="/assets/logo-text.webp" alt="kiosion logo" />
    </button>
    <button
      class="hidden md:inline-block -rotate-90 mx-auto my-16 lg:my-20 xl:my-24 w-28 lg:w-32 xl:w-36 logo-text"
      on:click={() => onLogoClick()}
    >
      <img class="w-full" src="/assets/logo-text--short.webp" alt="kio." />
    </button>
    {#if $menuOpen}
      <div
        class="flex md:hidden text-2xl flex-col justify-center mt-4 items-center"
        transition:slide|local
      >
        {#each links as link, index}
          <a
            class="nav-link font-mono font-normal uppercase text-base lg:text-lg"
            class:active={segment === link.url}
            class:mt-3={index > 0}
            aria-label={link.name}
            href={link.url}
            on:click={() => {
              menuOpen.set(false);
              $sounds === 'on' && click?.play();
            }}><span class="strike">{link.name}</span></a
          >
        {/each}
      </div>
    {/if}
    <div
      class="hidden md:flex text-base flex-col justify-center pt-4 items-center"
    >
      {#each links as link, index}
        <a
          class="nav-link font-mono font-normal uppercase text-base lg:text-lg"
          class:active={segment === link.url}
          class:mt-3={index > 0}
          aria-label={link.name}
          href={link.url}
          on:click={() => {
            menuOpen.set(false);
            $sounds === 'on' && click?.play();
          }}><span class="strike">{link.name}</span></a
        >
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
  .nav-link {
    .strike {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 0%;
        height: 1px;
        background-color: var(--textColour);
        transition: width 200ms ease, background 150ms ease;
      }
    }
    &:hover,
    &:focus,
    &:focus-within,
    &.active {
      .strike {
        &:after {
          width: 100%;
        }
      }
    }
  }
  .logo-text {
    img {
      transition: filter 150ms ease;
      .dark & {
        filter: invert(100%);
      }
    }
  }
</style>
