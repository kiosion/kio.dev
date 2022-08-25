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
  import { svgBackground, highlightEffects } from '@/stores/features';
  import BackgroundWaves from '@/components/background-waves.svelte';
  import type { LayoutData } from './$types';
  import FooterControls from '@/components/footer-controls.svelte';

  const unsubscribe = navigating.subscribe((res) => {
    loading.set(!res);
  });

  let appLoaded: boolean;

  let mousePos = [0, 0];
  let container: HTMLElement;
  let glow: HTMLElement;

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

  $: [clientX, clientY] = mousePos;

  const mouseMove = () => {
    if ($highlightEffects !== 'on' && !$navigating) {
      return;
    }
    try {
      const { left, top } = container.getBoundingClientRect();
      glow.style && (glow.style.left = `${clientX - left}px`);
      glow.style && (glow.style.top = `${clientY - top}px`);
    } catch {
      () => undefined;
    }
  };

  $: clientX, clientY, mouseMove();

  export let data: LayoutData;
  export let hovered: boolean;
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
  on:mousemove={(e) => (mousePos = [e.clientX, e.clientY])}
  on:mouseout={() => (mousePos = [-1000, -1000])}
  on:blur={() => (mousePos = [-1000, -1000])}
>
  <HeaderControls />
  <Nav segment={$page ? $page?.url?.pathname : ''} bind:hovered />
  <div class="h-full md:ml-40 lg:ml-60 px-8 pb-8 md:py-8 lg:px-10 xl:px-20">
    <div
      class="h-full w-full max-w-[60rem] mx-auto grid grid-rows-1 grid-cols-1"
    >
      {#if appLoaded}
        <PageTransition url={data.url.pathname}>
          <slot />
        </PageTransition>
      {/if}
    </div>
  </div>
  <FooterControls />
  <div
    class="fixed overflow-hidden pointer-events-none z-[-10] top-0 left-0 h-screen w-full md:rounded-l-[24px] md:ml-40 lg:ml-60"
    bind:this={container}
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
      {#if false}
        <div
          bind:this={glow}
          class="z-[-1] hidden md:block absolute unfilled w-[800px] h-[800px]"
        />
        <div
          class="hidden md:block absolute filled z-[-1] top-[-4px] left-[-4px] w-[110%] h-[110%] bg-slate-400 {hovered
            ? '!opacity-60'
            : ''} opacity-0 transition-opacity duration-150"
        />
        <div
          class="absolute z-[-2] top-[-4px] left-[-4px] w-[110%] h-[110%] bg-slate-100 dark:bg-slate-800 transition-colors duration-150"
        />
      {/if}
    </div>
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
    background-color: #e2e8f0;
    --textColour: #0f172a;
  }

  :global(body.dark) {
    background-color: #0f172a;
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

  .grid > * {
    grid-column: 1;
    grid-row: 1;
  }

  .unfilled {
    top: -9999px;
    left: -9999px;
    background: radial-gradient(#94a3b8, transparent 35%);
    transform: translate(-50%, -50%);
  }
</style>
