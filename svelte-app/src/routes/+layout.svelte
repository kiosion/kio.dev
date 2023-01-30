<script lang="ts">
  import '../app.scss';
  import 'cal-sans';
  import { onMount, onDestroy, setContext } from 'svelte';
  import { classList } from 'svelte-body';
  import { fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '$stores/theme';
  import { check as checkTranslations, currentLang, isLocalized } from '$i18n';
  import Loader from '$components/loading/full.svelte';
  import BarLoader from '$components/loading/bar.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import ScrollContainer from '$components/layouts/scroll-container.svelte';
  import Nav from '$components/nav/nav.svelte';
  import PageControls from '$components/controls/page-controls.svelte';
  import Features from '$stores/features';
  import type { LayoutData } from './$types';
  import { browser } from '$app/environment';
  import ContextMenu from '$components/context-menu.svelte';
  import { state as menuState } from '$stores/menu';
  import { setState as setMenuState } from '$lib/helpers/menu';
  import CustomCursor from '$components/custom-cursor.svelte';
  import { isDesktop } from '$helpers/responsive';
  import { useMediaQuery } from 'svelte-breakpoints';
  import { APP_LANGS, DEFAULT_APP_LANG } from '$lib/consts';
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
  use:classList={`w-full h-full overflow-x-hidden transition-colors ${
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
      classes="bg-stone-300/50 dark:bg-stone-900/50"
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
  class="main"
  class:is-desktop={$isDesktop}
  data-test-app-root
  data-test-theme={$theme}
  in:fly={{ delay: 100, duration: 100, y: -40 }}
  bind:this={pageContainer}
>
  <Nav />
  <ScrollContainer bind:element={scrollContainer}>
    <PageControls appBody={scrollContainer} position="top" />
    <div>
      {#if appLoaded}
        <PageTransition url={data.url}>
          <slot />
        </PageTransition>
      {/if}
    </div>
    <PageControls position="bottom" />
  </ScrollContainer>
</div>

<style lang="postcss">
  .main {
    @apply flex flex-col w-full h-full lg:text-lg overflow-x-hidden text-stone-900 transition-colors duration-150;

    div {
      @apply relative h-full w-full;
    }

    &.is-desktop {
      @apply flex-row;

      div {
        @apply mt-[3rem] h-[calc(100%_-_3rem)];
      }
    }
  }

  :global(.dark) {
    .main {
      @apply text-stone-50;
    }
  }
</style>
