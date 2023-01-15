<script lang="ts">
  import '../app.scss';
  import { onMount, onDestroy, setContext } from 'svelte';
  import { classList } from 'svelte-body';
  import { fade, fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '$stores/theme';
  import { check as checkTranslations, currentLang, isLocalized } from '$i18n';
  import Loader from '$components/loading/full.svelte';
  import BarLoader from '$components/loading/bar.svelte';
  import PageTransition from '$components/page-transition.svelte';
  import Nav from '$components/nav/nav.svelte';
  import HeaderControls from '$components/controls/header-controls.svelte';
  import Features from '$stores/features';
  import type { LayoutData } from './$types';
  import FooterControls from '$components/controls/footer-controls.svelte';
  import { browser } from '$app/environment';
  import ContextMenu from '$components/context-menu.svelte';
  import { state as menuState } from '$stores/menu';
  import { setState as setMenuState } from '$lib/helpers/menu';
  import CustomCursor from '$components/custom-cursor.svelte';
  import { useMediaQuery } from 'svelte-breakpoints';
  import {
    APP_LANGS,
    DEFAULT_APP_LANG,
    DEFAULT_DESKTOP_BREAKPOINT
  } from '$lib/consts';
  import { init as initAudio } from '$lib/sfx';

  interface DevToolsEvent extends Event {
    detail: {
      isOpen: boolean;
    };
  }

  let appLoaded: boolean,
    scrollContainer: HTMLDivElement,
    pageContainer: HTMLDivElement,
    preloadUrls = ['/assets/logo-text--short.webp'];

  const msg = (e: DevToolsEvent) =>
    e.detail?.isOpen &&
    console.log('%cHi there :)', 'font-size:18px;font-weight:bold;');

  const navUnsubscribe = navigating.subscribe((res) => {
    !res ? setTimeout(() => loading.set(false), 750) : loading.set(true);
  });

  const isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT);

  const unsubscribePreferReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)'
  ).subscribe((value) => {
    Features.set('reduce motion', value);
  });

  [
    ['getScrollContainer', () => scrollContainer],
    ['getPageContainer', () => pageContainer]
  ].forEach(([k, v]) => setContext(k, v));

  onMount(() => {
    initAudio({ volume: 0.1 }).catch(() => undefined);
    checkTranslations();
    if (browser) {
      window.addEventListener('devtoolschange', (e) => msg(e as DevToolsEvent));
      setTimeout(() => loading.set(false), 1000);
      appLoaded = true;
    }
  });

  onDestroy(() => {
    navUnsubscribe();
    unsubscribePreferReducedMotion();
    browser && window.removeEventListener('devtoolschange', () => msg);
  });

  export let data: LayoutData;

  $: useCustomCursor = Features.can('use custom cursor');
  $: useComicSans = Features.can('use comic sans');
  $: isLocalized.set(APP_LANGS.includes($page?.params?.lang));
  $: currentLang.set(
    APP_LANGS.includes($page?.params?.lang)
      ? $page?.params?.lang
      : DEFAULT_APP_LANG
  );
</script>

<svelte:head>
  {#each preloadUrls as image}
    <link rel="preload" as="image" href={image} />
  {/each}
</svelte:head>

<svelte:body
  use:classList={`w-full h-full overflow-x-hidden ${
    isDesktop ? 'desktop' : 'mobile'
  } ${$theme ?? 'dark'} ${
    !appLoaded || $navigating ? 'is-loading' : 'is-loaded'
  } ${appLoaded && 'app-loaded'} ${$useComicSans && 'comicSans'} ${
    $useCustomCursor && 'custom-cursor'
  }`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
/>

{#if !appLoaded}
  <Loader />
{/if}

{#if !$isDesktop && $loading}
  <div
    class="fixed top-0 left-0 w-[100vw] h-[3px] z-[50]"
    in:fly={{ x: 0, y: 3, duration: 600 }}
    out:fly={{ x: 0, y: -3, duration: 600 }}
  >
    <BarLoader
      width="100vw"
      height="3px"
      segments={16}
      classes="bg-slate-300/50 dark:bg-slate-900/50"
    />
  </div>
{/if}

{#if browser && $useCustomCursor}
  <CustomCursor {scrollContainer} showLoader={$loading || !appLoaded} />
{/if}

{#if $menuState.open}
  <ContextMenu {pageContainer} />
{/if}

<div
  class="flex {$isDesktop
    ? 'flex-row'
    : 'flex-col'} w-full h-full lg:text-lg overflow-x-hidden text-gray-800 dark:text-white text-primary transition-colors"
  in:fly={{ delay: 100, duration: 100, y: -10 }}
  bind:this={pageContainer}
>
  <Nav />
  <div
    class="relative h-full w-full overflow-x-clip overflow-y-scroll bg-gray-100 dark:bg-gray-800 rounded-t-3xl p-8 md:rounded-l-3xl md:rounded-tr-none overflow-visible transition-colors focusOutline"
    bind:this={scrollContainer}
  >
    <HeaderControls appBody={scrollContainer} />
    <div
      class="relative inner h-fit w-full max-w-[80rem] mx-auto {$isDesktop &&
        'mt-12'}"
    >
      {#if appLoaded}
        <PageTransition url={data.url}>
          <slot />
        </PageTransition>
      {/if}
    </div>
    <FooterControls />
  </div>
</div>
