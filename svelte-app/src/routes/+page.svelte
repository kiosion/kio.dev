<script lang="ts">
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';

  $: $page, setupNavigation($page?.url?.pathname);
</script>

<svelte:head>
  <title>kio.dev</title>
</svelte:head>

<div data-test-route="index">
  <div class="mt-[40vh] flex flex-col items-center">
    <p class="font-display text-3xl font-bold mb-2 w-fit">Hi, I'm Kio.</p>
    <p class="font-mono text-lg lowercase w-fit">
      software engineer / tech nerd / artist
    </p>
  </div>
</div>
