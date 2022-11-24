<script lang="ts">
  import '../app.scss';
  import { onMount, onDestroy, setContext } from 'svelte';
  import { classList } from 'svelte-body';
  import { fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '$stores/theme';
  import {
    check as checkTranslations,
    currentLang,
    isLocalized,
    linkTo
  } from '$i18n';
  import Loader from '$components/loading/full.svelte';
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
  import { handleScrollNav } from '$lib/helpers/navigation';
  import { canNavigate } from '$stores/navigation';
  import { useMediaQuery } from 'svelte-breakpoints';
  import {
    APP_LANGS,
    DEFAULT_APP_LANG,
    DEFAULT_DESKTOP_BREAKPOINT
  } from '$lib/consts';
  import { init as initAudio } from '$lib/sfx';
  import { goto } from '$app/navigation';

  interface DevToolsEvent {
    detail: {
      isOpen: boolean;
    };
  }

  let appLoaded: boolean,
    scrollContainer: HTMLDivElement,
    pageContainer: HTMLDivElement,
    preloadUrls = ['/assets/logo-text.webp', '/assets/logo-text--short.webp'];

  const msg = (e: DevToolsEvent) =>
    e.detail?.isOpen &&
    console.log('%cHi there :)', 'font-size:18px;font-weight:bold;');

  const navUnsubscribe = navigating.subscribe((res) => {
    !res ? setTimeout(() => loading.set(false), 750) : loading.set(true);
  });

  const isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT);

  [
    ['getScrollContainer', () => scrollContainer],
    ['getPageContainer', () => pageContainer]
  ].forEach(([k, v]) => setContext(k, v));

  onMount(async () => {
    initAudio({ volume: 0.1 });
    checkTranslations();
    msg({ detail: { isOpen: true } });
    browser &&
      window.addEventListener('devtoolschange', (e) =>
        msg(e as unknown as DevToolsEvent)
      );
    appLoaded = true;
    canNavigate.set(true);
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
  } ${appLoaded && 'app-loaded'} ${$CanUseComicSans && 'comicSans'} ${
    $CanUseCursor && 'custom-cursor'
  }`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
  on:wheel={(e) => handleScrollNav(e, scrollContainer, $page.url.pathname)}
/>

{#if !appLoaded}
  <Loader />
{/if}

{#if browser && $CanUseCursor}
  <CustomCursor {scrollContainer} showLoader={$loading || !appLoaded} />
{/if}

{#if $menuState.open}
  <ContextMenu {pageContainer} />
{/if}

<div
  class="flex {isMobile
    ? 'flex-col'
    : 'flex-row'} w-full h-full lg:text-lg overflow-x-hidden text-slate-800 dark:text-white text-primary transition-colors"
  in:fly={{ delay: 100, duration: 100, y: -10 }}
  bind:this={pageContainer}
>
  <Nav />
  <div
    class="relative h-full w-full overflow-x-clip overflow-y-scroll bg-slate-100 dark:bg-slate-800 rounded-t-3xl p-8 md:rounded-l-3xl md:rounded-tr-none transition-colors"
    bind:this={scrollContainer}
  >
    <HeaderControls appBody={scrollContainer} />
    <div
      class="relative inner h-fit w-full max-w-[80rem] mx-auto {!isMobile &&
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
