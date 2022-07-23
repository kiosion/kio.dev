<script>
  import Icon from '@iconify/svelte';
  
  let open = false;
</script>
<nav class="w-full p-4 md:p-8 md:pr-0 2xl:w-80 lg:w-64 md:w-36 md:fixed md:h-screen text-center flex flex-col-reverse md:flex-col overflow-y-auto">
  <!-- Logo -->
  <a class="-mt-6 -mb-2 mx-4 md:m-0 hover:scale-95" sveltekit:prefetch href="/logo">
    <img class="w-full pixel aspect-square" src="/assets/logo-light.png" alt="Logo" />
  </a>
  <!-- Nav links -->
  <div class="flex-grow -mt-10 md:mt-0">
    <a class="lg:text-4xl text-3xl" sveltekit:prefetch href="/">
      kio.dev
    </a>
    <div class="text-2xl md:text-base flex md:flex flex-col justify-center mt-4 items-center{open ? '' : ' hidden'}">
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
  <div class="md:hidden flex justify-between p-4">
    <button 
      class="nav-btn" 
      aria-label="Toggle nav"
      on:click="{() => open = !open}"
    >
      <Icon icon="mdi-dark:menu" />
      {open ? 'Close' : 'Menu'}
    </button>
    <label class="toggle text-lg md:text-base" for="theme-toggle">
      <input id="theme-toggle" class="toggle__input" type="checkbox">
      <div class="toggle__fill" />
    </label>
  </div>
</nav>

<style>
  button.nav-btn {
    font-size: .875rem;
    line-height: 1.25rem;
    color: #000;
  }

  label {
    --width: 3em;
    --height: calc(var(--width) / 2);
    --border-radius: calc(var(--height) / 2);
    display: inline-block;
    cursor: pointer;
  }

  input.toggle__input {
    display: none;
  }

  div.toggle__fill {
    image-rendering: pixelated;
    background-image: url(/assets/light.svg), url(/assets/dark.svg);
    background-repeat: no-repeat, no-repeat;
    background-position: top .3em right .4em, top .385em left .5em;
    background-size: .85em, .75em;
    background-color: var(--toggle-background);
    position: relative;
    width: var(--width);
    height: var(--height);
    border-radius: var(--border-radius);
    transition: background .2s ease;
    box-shadow: inset 0 0 1px #0003;
  }
</style>
