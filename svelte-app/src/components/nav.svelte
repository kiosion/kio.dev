<script>
  import Icon from '@iconify/svelte';
  import { theme } from '@/stores/theme';
  
  let open = false;
</script>
<nav class="w-full p-4 md:p-8 md:pr-0 2xl:w-80 lg:w-64 md:w-40 md:fixed md:h-screen text-center flex flex-col-reverse md:flex-col overflow-y-auto">
  <!-- Logo -->
  <a class="hidden md:block my-0 mx-auto hover:scale-105 logo" sveltekit:prefetch href="/logo">
    <img class="w-full p-6 lg:p-12 2xl:p-14 aspect-square" src="/assets/logo-large.png" alt="kio.dev logo" />
  </a>
  <!-- Nav links -->
  <div class="flex-grow -mt-10 md:-mt-4 click-through">
    <a class="block md:hidden mx-auto w-1/3 md:w-full logo-text" sveltekit:prefetch href="/">
      <img class="w-full" src="/assets/logo-text.png" alt="kiosion" />
    </a>
    <div class="text-2xl md:text-base flex md:flex flex-col justify-center mt-4 items-center {open ? '' : 'hidden'}">
      <a class="font-mono font-normal uppercase text-base lg:text-lg hover:font-bold" href="/">Blog</a>
      <a class="font-mono font-normal uppercase text-base lg:text-lg hover:font-bold mt-2" href="/works">Works</a>
      <a class="font-mono font-normal uppercase text-base lg:text-lg hover:font-bold mt-2" href="/about">About</a>
    </div>
  </div>
  <!-- Socials -->
  <div class="text-center text-secondary flex justify-center gap-4 pt-8 mx-auto hidden md:flex md:flex-col lg:flex-row">
    <a class="hover:text-primary" href="https://github.com/kiosion" aria-label="My Github">
      <Icon icon="akar-icons:github-fill" />
    </a>
  </div>
  <!-- Menu / toggle -->
  <div class="md:hidden flex justify-between p-4 click-through">
    <button
      class="nav-btn font-mono font-normal uppercase hover:font-bold" 
      aria-label="Toggle nav"
      on:click={() => open = !open}
    >{open ? 'Close' : 'Menu'}</button>
    <button
      class="font-mono font-normal uppercase hover:font-bold"
      aria-label="Toggle theme"
      on:click={() => theme.set($theme === 'light' ? 'dark' : 'light')}
    >{$theme === 'light' ? 'lights off' : 'lights on'}</button>
  </div>
</nav>

<style>
  .dark .logo img,
  .dark .logo-text img {
    filter: invert(100%);
  }

  .logo {
    width: fit-content;
    transition: transform 50ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }
</style>
