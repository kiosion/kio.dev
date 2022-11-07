<script lang="ts">
  import '../app.scss';
  import { onMount, onDestroy } from 'svelte';
  import { classList } from 'svelte-body';
  import { fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '$stores/theme';
  import { check, t } from '$lib/helpers/i18n';
  import Loader from '$components/loading/full.svelte';
  import PageTransition from '$components/page-transition.svelte';
  import Nav from '$components/nav.svelte';
  import HeaderControls from '$components/header-controls.svelte';
  import Features from '$stores/features';
  import type { LayoutData } from './$types';
  import FooterControls from '$components/footer-controls.svelte';
  import { browser } from '$app/environment';
  import ContextMenu from '$components/context-menu.svelte';
  import { state as menuState } from '$stores/menu';
  import { setState as setMenuState } from '$lib/helpers/menu';
  import CustomCursor from '$components/custom-cursor.svelte';
  import { handleScrollNav } from '$lib/helpers/navigation';
  import { navOpen, canNavigate } from '$stores/navigation';
  import { Boundary } from '$lib/error-bound';
  import Breakpoints, { useMediaQuery } from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS, DEFAULT_DESKTOP_BREAKPOINT } from '$lib/consts';

  const navUnsubscribe = navigating.subscribe((res) => {
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
  const isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT);

  onMount(async () => {
    appLoaded = true;
    canNavigate.set(true);
    check();
    msg({ detail: { isOpen: true } });
    browser &&
      window.addEventListener('devtoolschange', (e) =>
        msg(e as unknown as DevToolsEvent)
      );
    setTimeout(() => loading.set(false), 1000);
  });

  onDestroy(() => {
    navUnsubscribe();
    browser && window.removeEventListener('devtoolschange', () => msg);
  });

  export let data: LayoutData;

  $: isMobile = !$isDesktop;
  $: CanUseCursor = Features.can('use custom cursor feature');
  $: CanUseComicSans = Features.can('use comic sans feature');
</script>

<svelte:head>
  {#each preloadUrls as image}
    <link rel="preload" as="image" href={image} />
  {/each}
</svelte:head>

<svelte:body
  use:classList={`w-full h-full overflow-x-hidden ${
    isMobile ? 'mobile' : 'desktop'
  } ${$theme ?? 'dark'} ${
    !appLoaded || $navigating ? 'is-loading' : 'is-loaded'
  } ${appLoaded && 'app-loaded'} ${$CanUseComicSans && 'comicSans'} ${
    $CanUseCursor && 'custom-cursor'
  }`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
  on:wheel={(e) => handleScrollNav(e, pageContainer, $page.url.pathname)}
/>

{#if !appLoaded}
  <Loader theme="dark" />
{/if}

{#if browser && $CanUseCursor}
  <CustomCursor appBody={pageContainer} showLoader={$loading || !appLoaded} />
{/if}

{#if $menuState.open}
  <Boundary onError={console.error}>
    <svelte:component this={ContextMenu} page={pageContainer} />
  </Boundary>
{/if}

<div
  class="w-full h-full overflow-x-hidden  text-slate-800 dark:text-white md:text-lg text-primary bg-inverse transition-[background-color,border-color,text-decoration-color,fill,stroke] motion-reduce:transition-none"
  in:fly={{ delay: 100, duration: 100, y: -10 }}
  bind:this={pageContainer}
>
  <Boundary onError={console.error}>
    <HeaderControls appBody={pageContainer} />
  </Boundary>
  <Boundary onError={console.error}>
    <Nav segment={$page?.url ? $page.url.pathname : ''} />
  </Boundary>
  <div
    class="{isMobile
      ? `mt-6 p-8 ${$navOpen && 'mt-36'}`
      : 'h-full ml-40 xl:ml-60 p-8 xl:px-10 2xl:px-20'} transition-[margin-top] ease-linear"
  >
    <div
      class="h-full w-full max-w-[80rem] mx-auto grid grid-rows-1 grid-cols-1"
    >
      {#if appLoaded}
        <Boundary onError={console.error}>
          <PageTransition url={data?.url ? data.url.pathname : ''}>
            <slot />
          </PageTransition>
        </Boundary>
      {/if}
    </div>
  </div>
  <Boundary onError={console.error}>
    <FooterControls />
  </Boundary>
  <Breakpoints queries={DEFAULT_BREAKPOINTS}>
    <svelte:fragment slot="lg">
      <div
        class="fixed overflow-hidden pointer-events-none z-[-10] top-0 left-0 h-screen w-full rounded-l-3xl ml-40 xl:ml-60"
      >
        <div
          class="rounded-l-3xl absolute top-0 left-[1px] w-full h-full bg-slate-100 dark:bg-slate-800 transition-colors"
        />
      </div>
    </svelte:fragment>
    <svelte:fragment slot="sm">
      <div
        class="fixed overflow-hidden pointer-events-none z-[-10] top-0 left-0 h-screen w-full rounded-t-3xl {$navOpen
          ? 'mt-44'
          : 'mt-[4.4rem]'} transition-[margin-top] ease-linear"
      >
        <div
          class="rounded-t-3xl absolute top-[1px] left-0 w-full h-full bg-slate-100 dark:bg-slate-800 transition-colors"
        />
      </div>
    </svelte:fragment>
  </Breakpoints>
</div>

<style lang="scss">
  .grid > * {
    grid-column: 1;
    grid-row: 1;
  }
</style>
