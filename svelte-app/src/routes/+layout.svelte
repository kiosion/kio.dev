<script lang="ts">
  import '../app.scss';
  import { onMount, onDestroy } from 'svelte';
  import { classList } from 'svelte-body';
  import { fade, fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '$stores/theme';
  import Loader from '$components/loading/full.svelte';
  import PageTransition from '$components/page-transition.svelte';
  import Nav from '$components/nav.svelte';
  import HeaderControls from '$components/header-controls.svelte';
  import { svgBackground, customCursor, comicSans } from '$stores/features';
  import BackgroundWaves from '$components/background-waves.svelte';
  import type { LayoutData } from './$types';
  import FooterControls from '$components/footer-controls.svelte';
  import { browser } from '$app/environment';
  import { isMobile } from '$helpers/browser';
  import ContextMenu from '$components/context-menu.svelte';
  import { state as menuState } from '$stores/menu';
  import { setState as setMenuState } from '$lib/helpers/menu';
  import CustomCursor from '$components/custom-cursor.svelte';
  import { handleScrollNav } from '$lib/helpers/navigation';

  const unsubscribe = navigating.subscribe((res) => {
    !res ? setTimeout(() => loading.set(false), 750) : loading.set(true);
  });

  interface DevToolsEvent {
    detail: {
      isOpen: boolean;
    };
  }

  let appLoaded: boolean;
  let pageContainer: HTMLElement;
  let preloadUrls = ['/assets/logo-text.webp', '/assets/logo-text--short.webp'];
  const msg = (e: DevToolsEvent) =>
    e.detail.isOpen &&
    console.log('%cHi there :)', 'font-size:18px;font-weight:bold;');

  onMount(async () => {
    appLoaded = true;
    msg({ detail: { isOpen: true } });
    browser && window.addEventListener('devtoolschange', (e) => msg(e));
    browser && isMobile() && customCursor.set('off');
    setTimeout(() => loading.set(false), 1000);
  });

  onDestroy(() => {
    unsubscribe();
    browser && window.removeEventListener('devtoolschange', () => msg);
  });

  export let data: LayoutData;
</script>

<svelte:head>
  {#each preloadUrls as image}
    <link rel="preload" as="image" href={image} />
  {/each}
</svelte:head>

<svelte:body
  use:classList={`w-full h-full overflow-x-hidden ${
    isMobile() ? 'mobile' : 'desktop'
  } ${$theme ?? 'dark'} ${
    !appLoaded || $navigating ? 'is-loading' : 'is-loaded'
  } ${appLoaded && 'app-loaded'} ${$comicSans === 'on' && 'comicSans'} ${
    $customCursor === 'on' && 'custom-cursor'
  }`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
  on:wheel={(e) => handleScrollNav(e, pageContainer, $page.url.pathname)} />

{#if !appLoaded}
  <Loader theme="dark" />
{/if}

{#if browser && $customCursor === 'on'}
  <CustomCursor appBody={pageContainer} showLoader={$loading || !appLoaded} />
{/if}

<div
  class="w-full h-full overflow-x-hidden  text-slate-800 dark:text-white md:text-lg text-primary bg-inverse transition-[background-color,border-color,text-decoration-color,fill,stroke] motion-reduce:transition-none"
  in:fly={{ delay: 100, duration: 100, y: -10 }}
  bind:this={pageContainer}
>
  <HeaderControls />
  <Nav segment={$page?.url ? $page.url.pathname : ''} />
  <div class="md:h-full md:ml-40 xl:ml-60 px-8 pb-8 md:py-8 xl:px-10 2xl:px-20">
    <div
      class="h-full w-full max-w-[80rem] mx-auto grid grid-rows-1 grid-cols-1"
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
    class="fixed overflow-hidden pointer-events-none z-[-10] top-0 left-0 h-screen w-full md:rounded-l-2xl xl:rounded-l-3xl md:ml-40 xl:ml-60"
  >
    <div class="relative w-full h-full md:rounded-l-2xl xl:rounded-l-3xl">
      {#if $svgBackground === 'on'}
        <div in:fade={{ duration: 250 }} out:fade={{ duration: 250 }}>
          <BackgroundWaves
            classes="fixed w-full h-full top-0 left-0 opacity-30 dark:opacity-20 transition-opacity duration-150"
          />
        </div>
      {/if}
      <div
        class="md:rounded-l-2xl xl:rounded-l-3xl absolute top-0 left-[1px] w-full h-full bg-slate-100 dark:bg-slate-800 transition-colors duration-150"
      />
    </div>
  </div>
</div>

{#if $menuState.open}
  <svelte:component this={ContextMenu} page={pageContainer} />
{/if}

<style lang="scss">
  .grid > * {
    grid-column: 1;
    grid-row: 1;
  }
</style>
