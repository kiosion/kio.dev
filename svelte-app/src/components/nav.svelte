<script lang="ts">
  import { slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import ThemeToggle from '@/components/theme-toggle.svelte';
  import MenuToggle from '@/components/menu-toggle.svelte';
  import { menuOpen } from '@/stores/menu';

  let links = [
    { name: 'Blog', url: '/' },
    { name: 'Works', url: '/works' },
    { name: 'About', url: '/about' }
  ];

  let socials = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/0xKI0',
      icon: 'fa-brands:twitter'
    },
    {
      name: 'Github',
      url: 'https://github.com/kiosion',
      icon: 'fa-brands:github'
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/kiosion',
      icon: 'fa-brands:discord'
    },
    {
      name: 'PGP',
      url: '/pgp',
      icon: 'fa-solid:key',
      target: false,
      class: 'scale-90'
    }
  ];

  export let segment: string;
</script>

<nav
  class="w-full p-4 pt-8 md:p-8 md:pr-0 2xl:w-80 lg:w-64 md:w-40 md:fixed md:h-screen text-center flex flex-col-reverse md:flex-col overflow-y-auto"
>
  <div class="flex-grow -mt-10 md:-mt-4 click-through">
    <a class="block md:hidden mx-auto w-1/3 logo-text" sveltekit:prefetch href="/">
      <img class="w-full" src="/assets/logo-text.webp" alt="kiosion" />
    </a>
    <a
      class="hidden md:block mx-auto my-16 lg:my-20 xl:my-24 w-28 lg:w-32 xl:w-36 logo-text"
      sveltekit:prefetch
      href="/"
    >
      <img class="w-full -rotate-90" src="/assets/logo-text--short.webp" alt="kio." />
    </a>
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
            href={link.url}><span class="strike">{link.name}</span></a
          >
        {/each}
      </div>
    {/if}
    <div class="hidden md:flex text-base flex-col justify-center pt-4 items-center">
      {#each links as link, index}
        <a
          class="nav-link font-mono font-normal uppercase text-base lg:text-lg"
          class:active={segment === link.url}
          class:mt-3={index > 0}
          href={link.url}><span class="strike">{link.name}</span></a
        >
      {/each}
    </div>
  </div>
  <div
    class="text-center text-secondary align-center justify-center gap-4 pt-8 mx-auto hidden md:flex md:flex-col lg:flex-row"
  >
    {#each socials as social}
      <a
        class="flex align-center justify-center hover:text-slate-600 dark:hover:text-slate-300 {social?.class}"
        href={social.url}
        aria-label={social.name}
        target={social?.target ? '_blank' : ''}
      >
        <Icon icon={social.icon} />
      </a>
    {/each}
  </div>
  <div class="md:hidden flex align-center justify-between p-4 click-through">
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
