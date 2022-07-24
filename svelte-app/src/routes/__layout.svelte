<script>
  import Nav from '@/components/nav.svelte';
  import { theme } from '@/stores/theme';

  // !window.localStorage.getItem('theme') && window.localStorage.setItem('theme', 'light');
  // let theme = window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
</script>

<div
  class="md:text-lg text-primary bg-inverse transition motion-reduce:transition-none duration-150 {$theme}"
>
  <!-- Sidebar -->
  <Nav />

  <!-- Main content -->
  <div class="md:ml-36 lg:ml-64 xl:mr-48 2xl:mx-80 px-8 pb-8 md:py-8 md:px-12 lg:px-20">
    <slot></slot>
  </div>
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :global(.pixel) {
    image-rendering: pixelated !important;
  }
</style>
