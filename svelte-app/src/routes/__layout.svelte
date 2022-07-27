<script context="module" lang="ts">
  export const load: import('@sveltejs/kit').Load = async ({ url }) => ({
    props: { url }
  });
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { classList } from 'svelte-body';
  import { fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '@/stores/theme';
  import Loader from '@/components/loader.svelte';
  import PageTransition from '@/components/page-transition.svelte';
  import Nav from '@/components/nav.svelte';
  import ThemeToggle from '@/components/toggles/theme-toggle.svelte';

  const unsubscribe = navigating.subscribe((res) => {
    loading.set(!res);
  });

  let appLoading = true;

  onMount(() => {
    setTimeout(() => {
      appLoading = false;
      loading.set(false);
    });
  });

  onDestroy(() => {
    unsubscribe();
  });

  export let url: string;
</script>

<svelte:body
  use:classList={`w-full h-full ${$theme} ${
    $navigating ? 'is-loading' : 'is-loaded'
  }`} />

{#if appLoading}
  <Loader />
{/if}

<div
  class="w-full h-full text-slate-800 dark:text-white md:text-lg text-primary bg-inverse transition motion-reduce:transition-none duration-150"
  in:fly={{ delay: 100, duration: 100, y: -10 }}
>
  <Nav segment={$page.url.pathname} />
  <div
    class="md:ml-40 lg:ml-64 xl:mr-48 2xl:mx-80 px-8 pb-8 md:py-8 md:px-12 lg:px-20"
  >
    <div class="hidden md:flex justify-end items-center">
      <ThemeToggle />
    </div>
    <PageTransition {url}>
      <slot />
    </PageTransition>
  </div>
</div>

<style lang="scss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :global(body),
  :global(html) {
    height: 100vh;
    transition: background 150ms ease;
  }

  :global(body.light) {
    background: #f1f5f9;
    --textColour: #1e293b;
  }

  :global(body.dark) {
    background: #1e293b;
    --textColour: #f1f5f9;
  }

  :global(body:not(.is-loaded)) {
    cursor: wait !important;
  }

  :global(.is-loading a, .is-loading button) {
    cursor: wait !important;
  }

  :global(.pixel) {
    image-rendering: pixelated !important;
  }

  :global(.click-through) {
    pointer-events: none;
  }

  :global(.click-through a, .click-through button) {
    pointer-events: visible;
  }
</style>
