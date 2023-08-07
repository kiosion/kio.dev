<script lang="ts">
  import '../app.scss';
  import 'cal-sans';

  import { onDestroy, onMount, setContext } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  import { classList } from 'svelte-body';
  import { useMediaQuery } from 'svelte-breakpoints';

  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import { isDesktop } from '$helpers/responsive';
  import { check as checkTranslations, currentLang, isLocalized } from '$i18n';
  import { APP_LANGS, DEFAULT_APP_LANG } from '$lib/consts';
  import { setState as setMenuState, state as menuState } from '$lib/helpers/menu';
  import ToruSync from '$lib/helpers/toru';
  import Logger from '$lib/logger';
  import { init as initAudio } from '$lib/sfx';
  import { createExponentialBackoffStrategy } from '$lib/try-fetch';
  import { config } from '$stores/config';
  import Settings, { loading } from '$stores/settings';

  import ContextMenu from '$components/context-menu.svelte';
  import PageControls from '$components/controls/page-controls.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import ScrollContainer from '$components/layouts/scroll-container.svelte';
  import BarLoader from '$components/loading/bar.svelte';
  import Loader from '$components/loading/full.svelte';
  import Navigation from '$components/nav.svelte';

  import type { LayoutData } from './$types';
  import type { Unsubscriber } from 'svelte/store';

  const { theme, comicSans, reduceMotion } = Settings;

  let appLoaded: boolean,
    scrollContainer: HTMLDivElement,
    pageContainer: HTMLDivElement,
    preloadUrls = ['/assets/logo-text--short.webp'],
    unsubscribers = [] as Unsubscriber[],
    invalidationStrategy = createExponentialBackoffStrategy({
      maxRetries: 5,
      baseDelay: 1000,
      onAttempt: invalidateAll
    });

  unsubscribers.push(
    navigating.subscribe((res) => {
      !res ? setTimeout(() => loading.set(false), 750) : loading.set(true);
    }),
    useMediaQuery('(prefers-reduced-motion: reduce)').subscribe((value) => {
      reduceMotion?.set(value);
    })
  );

  [
    ['getScrollContainer', () => scrollContainer],
    ['getPageContainer', () => pageContainer]
  ].forEach(([k, v]) => setContext(k, v));

  onMount(() => {
    initAudio({ volume: 0.1 }).catch(console.error);
    checkTranslations();

    if (browser) {
      setTimeout(() => loading.set(false), 1000);
      appLoaded = true;
      try {
        ToruSync.init();
      } catch (e) {
        Logger.error(e as string);
      }
    }
  });

  onDestroy(() => {
    ToruSync.stop();

    unsubscribers.forEach((u) => u());
  });

  export let data: LayoutData;

  $: isLocalized.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
  );
  $: currentLang.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
      ? $page?.params?.lang
      : DEFAULT_APP_LANG
  );
  $: browser && data.config && config.set(data.config);
  $: browser && (!data.author || !data.config) && invalidationStrategy();
</script>

<svelte:head>
  {#each preloadUrls as image}
    <link rel="preload" as="image" href={image} />
  {/each}
</svelte:head>

<svelte:body
  use:classList={`${$theme ?? 'dark'} ${
    !appLoaded || $navigating ? 'is-loading' : 'is-loaded'
  } ${$comicSans ? 'comicSans' : ''}`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
/>

{#if !appLoaded}
  <Loader theme={data.theme} phrase={data.loadingPhrase} />
{/if}

{#if !$isDesktop && $loading}
  <span
    class="fixed left-0 top-0 z-[50] h-[3px] w-[100vw]"
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
        <PageTransition pathname={data.pathname}>
          <slot />
        </PageTransition>
      {/if}
    </div>
    <PageControls position="bottom" />
  </ScrollContainer>
</div>

<style lang="scss">
  .main {
    @apply flex h-full w-full flex-col overflow-x-hidden text-dark;

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
      @apply text-light;
    }
  }
</style>
