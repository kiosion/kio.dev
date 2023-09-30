<script lang="ts">
  import '../app.scss';

  import { onDestroy, onMount, setContext } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  import { classList } from 'svelte-body';
  import { useMediaQuery } from 'svelte-breakpoints';

  import { navigating, page } from '$app/stores';
  import { isDesktop } from '$helpers/responsive';
  import { check as checkTranslations, currentLang, isLocalized, t } from '$i18n';
  import { APP_LANGS, DEFAULT_APP_LANG } from '$lib/consts';
  import { ENV } from '$lib/env';
  import { setState as setMenuState, state as menuState } from '$lib/helpers/menu';
  import Settings, { loading } from '$stores/settings';

  import ContextMenu from '$components/context-menu.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import ScrollContainer from '$components/layouts/scroll-container.svelte';
  import BarLoader from '$components/loading/bar.svelte';
  import Nav from '$components/nav.svelte';

  import type { Navigation } from '@sveltejs/kit';
  import type { Unsubscriber } from 'svelte/store';

  let scrollContainer: HTMLDivElement,
    pageContainer: HTMLDivElement,
    unsubscribers = [] as Unsubscriber[],
    setLoadingTimer: ReturnType<typeof setTimeout> | undefined,
    toggleNav: (vis: boolean) => void,
    appLoaded = false;

  const { theme, reduce_motion } = Settings,
    setLoading = (navigating: Navigation | null) => {
      clearTimeout(setLoadingTimer);
      if (navigating && navigating.from !== navigating.to) {
        setLoadingTimer = setTimeout(() => loading.set(true), 500);
      } else {
        loading.set(false);
      }
    },
    skipToContent = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        const content = document.getElementById('content-wrapper'),
          focusable = content?.querySelectorAll(
            '[tabindex="0"], a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
          ),
          elem = focusable?.[0] as HTMLElement | null;
        elem?.focus();
        // @ts-expect-error - scrollToOptions is not yet in the DOM typings
        elem?.scrollTo({ behavior: 'smooth', block: 'center' });
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
    ENV !== 'production' && checkTranslations();

    setTimeout(() => {
      loading.set(false);
    }, 1000);
    appLoaded = true;
  });

  onDestroy(() => {
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
</script>

<svelte:body
  use:classList={`${$theme} ${$navigating ? 'is-loading' : 'is-loaded'}`}
  on:contextmenu|preventDefault={(e) => setMenuState(e, pageContainer)}
/>

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

<span
  class="focusOutline-sm absolute left-1/2 top-0 z-50 -mt-10 -translate-x-1/2 cursor-pointer rounded-md bg-light px-4 py-2 text-sm font-bold text-dark transition-[margin-top,background-color,color] focus-visible:mt-4 dark:bg-dark dark:text-light"
  role="button"
  aria-label={$t('Skip to content')}
  tabindex="0"
  in:fly={{ delay: 100, duration: 100, y: -40 }}
  out:fly={{ duration: 100, y: 40 }}
  on:keydown={skipToContent}>{$t('Skip to content')}</span
>

<div
  class="main relative flex h-full w-full flex-col overflow-x-hidden rounded-xl text-dark dark:text-light lg:flex-row lg:text-lg"
  in:fly={{ delay: 100, duration: 100, y: -40 }}
  bind:this={pageContainer}
>
  <Nav loaded={appLoaded && !$loading} bind:toggle={toggleNav} />
  <ScrollContainer
    bind:element={scrollContainer}
    on:scrollDown={() => toggleNav(false)}
    on:scrollUp={() => toggleNav(true)}
  >
    <div class="relative mt-16 max-h-full w-full">
      <PageTransition pathname={data.pathname}>
        <slot />
      </PageTransition>
    </div>
  </ScrollContainer>
</div>
