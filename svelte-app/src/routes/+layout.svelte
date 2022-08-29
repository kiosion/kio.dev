<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { classList } from 'svelte-body';
  import { fade, fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '$stores/theme';
  import Loader from '$components/loading/full.svelte';
  import PageTransition from '$components/page-transition.svelte';
  import Nav from '$components/nav.svelte';
  import HeaderControls from '$components/header-controls.svelte';
  import { svgBackground } from '$stores/features';
  import BackgroundWaves from '$components/background-waves.svelte';
  import type { LayoutData } from './$types';
  import FooterControls from '$components/footer-controls.svelte';

  import ContextMenu from '$components/context-menu.svelte';
  import { state as menuState } from '$stores/menu';
  import { setState as setMenuState } from '$lib/helpers/menu';

  const unsubscribe = navigating.subscribe((res) => {
    loading.set(!res);
  });

  let appLoaded: boolean;
  let pageContainer: HTMLElement;

  onMount(() => {
    appLoaded = true;
    loading.set(false);
  });

  onDestroy(() => {
    unsubscribe();
  });

  export let data: LayoutData;
</script>

<svelte:body
  use:classList={`w-full h-full overflow-x-hidden ${$theme ?? 'dark'} ${
    !appLoaded || $navigating ? 'is-loading' : 'is-loaded'
  }`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)} />

{#if !appLoaded}
  <Loader theme="dark" />
{/if}

<div
  class="w-full h-fit min-h-full overflow-x-hidden  text-slate-800 dark:text-white md:text-lg text-primary bg-inverse transition-[background-color,border-color,text-decoration-color,fill,stroke] motion-reduce:transition-none"
  in:fly={{ delay: 100, duration: 100, y: -10 }}
  bind:this={pageContainer}
>
  <HeaderControls />
  <Nav segment={$page?.url ? $page.url.pathname : ''} />
  <div
    class="h-fit md:min-h-full md:ml-40 lg:ml-60 px-8 pb-8 md:py-8 lg:px-10 xl:px-20"
  >
    <div
      class="h-fit min-h-full w-full max-w-[60rem] mx-auto grid grid-rows-1 grid-cols-1"
    >
      {#if appLoaded}
        <PageTransition url={data?.url ? data.url.pathname : ''}>
          <slot />
        </PageTransition>
      {/if}
    </div>
  </div>
  <FooterControls />
  <div
    class="fixed overflow-hidden pointer-events-none z-[-10] top-0 left-0 h-screen w-full md:rounded-l-[24px] md:ml-40 lg:ml-60"
  >
    <div class="relative w-full h-full md:rounded-l-[24px]">
      {#if $svgBackground === 'on'}
        <div in:fade={{ duration: 250 }} out:fade={{ duration: 250 }}>
          <BackgroundWaves
            classes="fixed w-full h-full top-0 left-0 opacity-30 dark:opacity-20 transition-opacity duration-150"
          />
        </div>
      {/if}
      <div
        class="md:rounded-l-[24px] absolute top-0 left-[1px] w-full h-full bg-slate-100 dark:bg-slate-800 transition-colors duration-150"
      />
    </div>
  </div>
</div>

{#if $menuState.open}
  <svelte:component this={ContextMenu} page={pageContainer} />
{/if}

<style lang="scss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :global(body),
  :global(html) {
    height: 100vh;
    transition: background 150ms ease;
  }

  :global(body) {
    background-color: #0f172a;
    --textColour: #f1f5f9;
  }

  :global(body.light) {
    background-color: #e2e8f0;
    --textColour: #0f172a;
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

  .grid > * {
    grid-column: 1;
    grid-row: 1;
  }
</style>
