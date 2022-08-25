<script lang="ts">
  import { navOptions, pageHeading } from '@/stores/menu';
  import { handleScrollNav } from '$lib/helpers/navigation';

  let scrollContainer: HTMLElement;

  navOptions.set({ down: '/blog', up: '' });
  pageHeading.set('');
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div
  data-test-route="index"
  bind:this={scrollContainer}
  on:wheel={(e) => handleScrollNav(e, scrollContainer, { down: '/blog' })}
>
  <div class="mt-[38vh] flex flex-col items-center">
    <p class="font-display text-3xl font-bold mb-2 w-fit">Hi, I'm Kio.</p>
    <p class="font-mono text-lg lowercase w-fit">
      software engineer / tech nerd / artist
    </p>
  </div>
</div>
