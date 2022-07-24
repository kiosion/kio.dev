<script>
  import Icon from '@iconify/svelte';
  import { theme } from '@/stores/theme';
  
  let open = false;
</script>
<nav class="w-full p-4 md:p-8 md:pr-0 2xl:w-80 lg:w-64 md:w-36 md:fixed md:h-screen text-center flex flex-col-reverse md:flex-col overflow-y-auto">
  <!-- Logo -->
  <a class="-mt-2 mb-0 mx-4 md:m-0 hover:scale-95" sveltekit:prefetch href="/logo">
    <img class="w-full pixel aspect-square" src="/assets/logo-light.png" alt="Logo" />
  </a>
  <!-- Nav links -->
  <div class="flex-grow -mt-10 md:mt-0 click-through">
    <a class="lg:text-4xl text-3xl" sveltekit:prefetch href="/">
      kio.dev
    </a>
    <div class="text-2xl md:text-base flex md:flex flex-col justify-center mt-4 items-center {open ? '' : 'hidden'}">
      <a class="main-nav-link" href="/">Blog</a>
      <a class="main-nav-link" href="/about">About</a>
      <a class="main-nav-link" href="/works">Works</a>
    </div>
  </div>
  <!-- Socials -->
  <div class="text-center text-secondary flex justify-center gap-4 pt-8 hidden md:flex md:flex-col lg:flex-row">
    <a class="hover:text-primary" href="https://github.com/kiosion" aria-label="My Github">
      <Icon icon="akar-icons:github-fill" />
    </a>
  </div>
  <!-- Menu / toggle -->
  <div class="md:hidden flex justify-between p-4 click-through">
    <button
      class="nav-btn hover:text-blue-900" 
      aria-label="Toggle nav"
      on:click={() => open = !open}
    >
      <!-- <Icon icon="mdi-dark:menu" /> -->
      {open ? 'Close' : 'Menu'}
    </button>
    <button
      class="hover:text-blue-900"
      aria-label="Toggle theme"
      on:click={() => theme.set($theme === 'light' ? 'dark' : 'light')}
    >Toggle theme</button>
  </div>
</nav>

<style>
  div.click-through {
    pointer-events: none;
  }

  div.click-through a,
  div.click-through button {
    pointer-events: visible;
  }
</style>
