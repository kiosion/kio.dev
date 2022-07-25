<script>
  import Icon from '@iconify/svelte';
  import ThemeToggle from '@/components/theme-toggle.svelte';
  import MenuToggle from '@/components/menu-toggle.svelte';
  import { menuOpen } from '@/stores/menu';
</script>
<nav class="w-full p-4 md:p-8 md:pr-0 2xl:w-80 lg:w-64 md:w-40 md:fixed md:h-screen text-center flex flex-col-reverse md:flex-col overflow-y-auto">
  <!-- Nav links -->
  <div class="flex-grow -mt-10 md:-mt-4 click-through">
    <!-- Logos -->
    <a class="block md:hidden mx-auto w-1/3 logo-text" sveltekit:prefetch href="/">
      <img class="w-full" src="/assets/logo-text.png" alt="kiosion" />
    </a>
    <a class="hidden md:block mx-auto my-16 lg:my-20 xl:my-24 w-28 lg:w-32 xl:w-36 logo-text" sveltekit:prefetch href="/">
      <img class="w-full -rotate-90" src="/assets/logo-text--short.png" alt="kio." />
    </a>
    <div class="text-2xl md:text-base flex md:flex flex-col justify-center mt-4 items-center {$menuOpen ? '' : 'hidden'}">
      <a class="font-mono font-normal uppercase text-base lg:text-lg hover:font-bold" href="/">Blog</a>
      <a class="font-mono font-normal uppercase text-base lg:text-lg hover:font-bold mt-2" href="/works">Works</a>
      <a class="font-mono font-normal uppercase text-base lg:text-lg hover:font-bold mt-2" href="/about">About</a>
    </div>
  </div>
  <!-- Socials -->
  <div class="text-center text-secondary flex align-center justify-center gap-4 pt-8 mx-auto hidden md:flex md:flex-col lg:flex-row">
    <a class="flex align-center justify-center hover:text-slate-600 dark:hover:text-slate-300" href="https://twitter.com/0xKI0" target="_blank" aria-label="Twitter">
      <Icon icon="fa-brands:twitter" />
    </a>
    <a class="flex align-center justify-center hover:text-slate-600 dark:hover:text-slate-300" href="https://github.com/kiosion" target="_blank" aria-label="Github">
      <Icon icon="fa-brands:github" />
    </a>
    <a class="flex align-center justify-center hover:text-slate-600 dark:hover:text-slate-300" href="https://discord.gg/kiosion" target="_blank" aria-label="Discord">
      <Icon icon="fa-brands:discord" />
    </a>
    <a class="flex align-center justify-center hover:text-slate-600 dark:hover:text-slate-300 scale-90" href="/pgp" aria-label="PGP Key" sveltekit:prefetch>
      <Icon icon="fa-solid:key" />
    </a>
  </div>
  <!-- Menu / toggle -->
  <div class="md:hidden flex justify-between p-4 click-through">
    <MenuToggle />
    <ThemeToggle />
  </div>
</nav>

<style lang="scss">
  .dark {
    .logo-text {
      img {
        filter: invert(100%);
      }
    }
  }
</style>
