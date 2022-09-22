<script lang="ts">
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });
</script>

<svelte:head>
  <title>kio.dev | blog & portfolio</title>
</svelte:head>

<div data-test-route="index">
  <div
    class="mt-[20vh] md:mt-[50vh] h-fit w-80 mx-auto flex flex-col items-center md:items-start justify-center gap-2"
  >
    <p class="font-display text-3xl font-bold w-fit mt-14 md:-mt-[10vh] mb-5">
      Hi, I'm Kio<span class="text-emerald-300 ml-[2px]">.</span>
    </p>
    <p class="font-sans text-lg -mb-1">Software engineer / web dev / artist</p>
    <p class="font-sans text-lg">Lover of cats &amp; all things tech</p>
  </div>
</div>
