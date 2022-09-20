<script lang="ts">
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  // import SafeIcon from '$components/safe-icon.svelte';
  // import Divider from '$components/divider.svelte';
  // import { browser } from '$app/environment';
  // import { fly } from 'svelte/transition';
  // import { goto } from '$app/navigation';

  let showScrollDown = false;

  $: $page, setupNavigation($page?.url?.pathname);
  // $: browser && setTimeout(() => goto('/blog'), 16000);
</script>

<svelte:head>
  <title>kio.dev</title>
</svelte:head>

<div data-test-route="index">
  <div
    class="content h-full w-80 mx-auto flex flex-col items-start justify-center gap-2 {showScrollDown
      ? 'showMore'
      : ''}"
  >
    <p class="font-display text-3xl font-bold w-fit mt-14 md:-mt-14 mb-4">
      Hi, I'm Kio
    </p>
    <!-- <div class="flex flex-row align-center justify-center w-60">
      <SafeIcon icon="Info-Box" width={18} classes="text-slate-400" />
      <Divider classes="ml-2 my-auto" />
    </div> -->
    <p class="font-sans text-lg lowercase mt-2">
      Software engineer / web dev / artist
    </p>
    <p class="font-sans text-lg lowercase mb-2">
      Lover of cats &amp; all things tech
    </p>
  </div>
</div>
