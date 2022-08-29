<script lang="ts">
  import { navOptions, pageHeading } from '$stores/nav';
  import { handleScrollNav } from '$lib/helpers/navigation';
  import { sounds } from '$stores/features';
  import type UIfx from 'uifx';
  import { onMount } from 'svelte';

  let click: UIfx;

  let scrollContainer: HTMLElement;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

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
  <div class="mt-[40vh] flex flex-col items-center">
    <p class="font-display text-3xl font-bold mb-2 w-fit">Hi, I'm Kio.</p>
    <p class="font-mono text-lg lowercase w-fit">
      software engineer / tech nerd / artist
    </p>
  </div>
</div>
