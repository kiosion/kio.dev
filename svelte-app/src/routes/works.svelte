<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  export const load: Load = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
  };
</script>

<svelte:head>
  <title>kio.dev | works</title>
</svelte:head>

<h1 class="font-code font-bold text-4xl text-center my-8 lowercase">works</h1>
<p class="text-center">Some placeholder text for now.</p>
