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
  import Settings, { loading } from '$stores/settings';

  import ContextMenu from '$components/context-menu.svelte';
  import PageControls from '$components/controls/page-controls.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import ScrollContainer from '$components/layouts/scroll-container.svelte';
  import BarLoader from '$components/loading/bar.svelte';
  import Loader from '$components/loading/full.svelte';
  import Nav from '$components/nav.svelte';

  import type { Navigation } from '@sveltejs/kit';
  import type { Unsubscriber } from 'svelte/store';

  let appLoaded: boolean,
    scrollContainer: HTMLDivElement,
    pageContainer: HTMLDivElement,
    preloadUrls = ['/assets/logo-text--short.webp'],
    unsubscribers = [] as Unsubscriber[],
    setLoadingTimer: ReturnType<typeof setTimeout> | undefined,
    invalidationStrategy = createExponentialBackoffStrategy({
      maxRetries: 5,
      baseDelay: 1000,
      onAttempt: invalidateAll
    });

  const { theme, reduce_motion } = Settings,
    setLoading = (navigating: Navigation | null) => {
      clearTimeout(setLoadingTimer);
      if (navigating && navigating.from !== navigating.to) {
        setLoadingTimer = setTimeout(() => loading.set(true), 500);
      } else {
        loading.set(false);
      }
    };

  unsubscribers.push(
    navigating.subscribe(setLoading),
    useMediaQuery('(prefers-reduced-motion: reduce)').subscribe((value) => {
      reduce_motion?.set(value);
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
      try {
        ToruSync.init();
      } catch (e) {
        Logger.error(e as string);
      }
    }

    setTimeout(() => loading.set(false), 1000);
    appLoaded = true;
  });

  onDestroy(() => {
    ToruSync.stop();
    unsubscribers.forEach((u) => u());
  });

  export let data;

  $: isLocalized.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
  );
  $: currentLang.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
      ? $page?.params?.lang
      : DEFAULT_APP_LANG
  );
  $: browser && (!data.author || !data.config) && invalidationStrategy();
</script>

<svelte:head>
  {#each preloadUrls as image}
    <link rel="preload" as="image" href={image} />
  {/each}
</svelte:head>

<svelte:body
  use:classList={`${$theme || data.theme} ${
    !appLoaded || $navigating ? 'is-loading' : 'is-loaded'
  }`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
/>

{#if !appLoaded}
  <Loader theme={data.theme} phrase={data.loadingPhrase} />
{/if}

{#if !$isDesktop && $loading}
  <span
    class="fixed left-0 top-0 z-[50] h-[3px] w-[100vw]"
    in:fade={{ duration: 50 }}
    out:fade={{ duration: 50, delay: 500 }}
  >
    <BarLoader width="100vw" height="3px" />
  </span>
{/if}

{#if $menuState.open}
  <ContextMenu />
{/if}

<div
  class="main flex h-full w-full overflow-x-hidden text-dark dark:text-light {$isDesktop
    ? 'flex-row text-lg'
    : 'flex-col'}"
  in:fly={{ delay: 100, duration: 100, y: -40 }}
  bind:this={pageContainer}
>
  <Nav config={data.config} />
  <ScrollContainer bind:element={scrollContainer}>
    <PageControls appBody={scrollContainer} position="top" />
    <div
      class="relative max-h-full w-full {$isDesktop
        ? 'mt-[1.6rem] h-[calc(100%-1.6rem)]'
        : ''}"
    >
      <PageTransition pathname={data.pathname}>
        <slot />
      </PageTransition>
    </div>
    <PageControls position="bottom" />
  </ScrollContainer>
</div>
