<script lang="ts">
  import '../app.scss';
  import 'cal-sans';
  import { onMount, onDestroy, setContext } from 'svelte';
  import { get, type Unsubscriber } from 'svelte/store';
  import { classList } from 'svelte-body';
  import { fade, fly } from 'svelte/transition';
  import { page, navigating } from '$app/stores';
  import { loading, theme } from '$stores/theme';
  import { check as checkTranslations, currentLang, isLocalized } from '$i18n';
  import Loader from '$components/loading/full.svelte';
  import BarLoader from '$components/loading/bar.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import ScrollContainer from '$components/layouts/scroll-container.svelte';
  import Navigation from '$components/nav.svelte';
  import PageControls from '$components/controls/page-controls.svelte';
  import Features from '$stores/features';
  import { browser } from '$app/environment';
  import ContextMenu from '$components/context-menu.svelte';
  import {
    state as menuState,
    setState as setMenuState
  } from '$lib/helpers/menu';
  import { isDesktop } from '$helpers/responsive';
  import { useMediaQuery } from 'svelte-breakpoints';
  import { APP_LANGS, DEFAULT_APP_LANG } from '$lib/consts';
  import { init as initAudio } from '$lib/sfx';
  import { config } from '$stores/config';
  import { invalidateAll } from '$app/navigation';
  import type { LayoutData } from './$types';

  interface DevToolsEvent extends Event {
    detail: {
      isOpen: boolean;
    };
  }

  let appLoaded: boolean,
    scrollContainer: HTMLDivElement,
    pageContainer: HTMLDivElement,
    preloadUrls = ['/assets/logo-text--short.webp'],
    unsubscribers = [] as Unsubscriber[];

  const msg = (e: DevToolsEvent) =>
    e.detail?.isOpen &&
    console.log('%cHi there :)', 'font-size:18px;font-weight:bold;');

  unsubscribers.push(
    navigating.subscribe((res) => {
      !res ? setTimeout(() => loading.set(false), 750) : loading.set(true);
    }),
    useMediaQuery('(prefers-reduced-motion: reduce)').subscribe((value) => {
      Features.set('reduce motion', value);
    })
  );

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
    unsubscribers.forEach((u) => u());
    browser && window.removeEventListener('devtoolschange', () => msg);
  });

  export let data: LayoutData;

  $: useComicSans = Features.can('use comic sans');
  $: isLocalized.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
  );
  $: currentLang.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
      ? $page?.params?.lang
      : DEFAULT_APP_LANG
  );
  $: browser && (!data.author || !get(config)?.data) && invalidateAll();
</script>

<svelte:head>
  {#each preloadUrls as image}
    <link rel="preload" as="image" href={image} />
  {/each}
</svelte:head>

<svelte:body
  use:classList={`${$theme ?? 'dark'} ${
    !appLoaded || $navigating ? 'is-loading' : 'is-loaded'
  } ${$useComicSans ? 'comicSans' : ''}`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
/>

{#if !appLoaded}
  <Loader />
{/if}

{#if !$isDesktop && $loading}
  <span
    class="fixed top-0 left-0 z-[50] h-[3px] w-[100vw]"
    in:fade={{ duration: 50 }}
    out:fade={{ duration: 50, delay: 750 }}
  >
    <BarLoader width="100vw" height="3px" />
  </span>
{/if}

{#if $menuState.open}
  <ContextMenu />
{/if}

<div
  class="main"
  class:is-desktop={$isDesktop}
  data-test-theme={$theme}
  in:fly={{ delay: 100, duration: 100, y: -40 }}
  bind:this={pageContainer}
>
  <Navigation />
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

<style lang="scss">
  .main {
    @apply flex h-full w-full flex-col overflow-x-hidden text-stone-900;

    div {
      @apply relative h-full w-full;
    }

    &.is-desktop {
      @apply flex-row text-lg;

      div {
        margin-top: 1.6rem;
        height: calc(100% - 1.6rem);
      }
    }
  }

  :global(.dark) {
    .main {
      @apply text-stone-50;
    }
  }
</style>
