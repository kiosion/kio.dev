<script lang="ts" context="module">
  export const load: import('@sveltejs/kit').Load = async () => {
    const now = performance.now();
    const delta = performance.now() - now;
    delta < 200 &&
      (await new Promise((resolve) => setTimeout(resolve, 200 - delta)));
  };
</script>

<svelte:head>
  <title>kio.dev | about</title>
</svelte:head>

<div data-test-route="about">
  <h1 class="font-code font-bold text-4xl text-center my-8 lowercase">about</h1>
  <p class="text-center">Some placeholder text for now.</p>
</div>
