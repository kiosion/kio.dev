<script>
  import Nav from '@/components/nav.svelte';
  import { theme } from '@/stores/theme';
</script>

<div class="w-full h-full {$theme}">
  <div
    class="w-full h-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white md:text-lg text-primary bg-inverse transition motion-reduce:transition-none duration-150"
  >
    <!-- Sidebar -->
    <Nav />

    <!-- Main content -->
    <div class="md:ml-40 lg:ml-64 xl:mr-48 2xl:mx-80 px-8 pb-8 md:py-8 md:px-12 lg:px-20">
      <slot></slot>
    </div>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;1,100;1,200;1,300;1,400&display=swap');

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :global(body) {
    height: 100vh;
  }

  :global(.pixel) {
    image-rendering: pixelated !important;
  }

  :global(.click-through) {
    pointer-events: none;
  }

  :global(.click-through a),
  :global(.click-through button) {
    pointer-events: visible;
  }
</style>
