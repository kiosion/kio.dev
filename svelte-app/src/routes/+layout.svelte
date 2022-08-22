<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { classList } from 'svelte-body';
  import { fade, fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '@/stores/theme';
  import Loader from '@/components/loader/full.svelte';
  import PageTransition from '@/components/page-transition.svelte';
  import Nav from '@/components/nav.svelte';
  import HeaderControls from '@/components/header-controls.svelte';
  import { svgBackground } from '@/stores/features';
  import BackgroundWaves from '@/components/background-waves.svelte';
  import type { LayoutData } from './$types';

  const unsubscribe = navigating.subscribe((res) => {
    loading.set(!res);
  });

  let appLoaded: boolean;
  const now = performance.now();

  onMount(() => {
    const timeout = performance.now() - now < 2000 ? 2000 - now : 0;
    setTimeout(() => {
      appLoaded = true;
      loading.set(false);
    }, timeout);
  });

  onDestroy(() => {
    unsubscribe();
  });

  export let data: LayoutData;
</script>

<svelte:body
  use:classList={`w-full h-full ${
    appLoaded ? '' : 'overflow-hidden'
  } ${$theme} ${!appLoaded || $navigating ? 'is-loading' : 'is-loaded'}`} />

{#if !appLoaded}
  <Loader theme="dark" />
{/if}

<div
  class="w-full h-full text-slate-800 dark:text-white md:text-lg text-primary bg-inverse transition motion-reduce:transition-none duration-150 "
  in:fly={{ delay: 100, duration: 100, y: -10 }}
>
  <Nav segment={$page ? $page?.url?.pathname : ''} />
  <div
    class="relative md:ml-40 lg:ml-64 xl:mr-48 2xl:mx-80 px-8 pb-8 md:py-8 md:pr-12 lg:pr-20"
  >
    {#if appLoaded}
      <HeaderControls />
      <PageTransition url={data.url}>
        <slot />
      </PageTransition>
    {/if}
  </div>
  {#if $svgBackground === 'on'}
    <div in:fade={{ duration: 250 }} out:fade={{ duration: 250 }}>
      <BackgroundWaves
        classes="fixed w-full h-full top-0 left-0 opacity-30 dark:opacity-20 transition-opacity duration-150"
      />
    </div>
  {/if}
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
    background-color: #f1f5f9;
    --textColour: #1e293b;
  }

  :global(body.dark) {
    background-color: #1e293b;
    --textColour: #f1f5f9;
  }

  :global(::selection) {
    background: #34d399;
    color: #1e293b;
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
