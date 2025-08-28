<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  // eslint-disable-next-line no-restricted-imports
  import '../tailwind.css';
  // eslint-disable-next-line no-restricted-imports
  import '../app.scss';
  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import Footer from '$components/new/footer.svelte';
  import Header from '$components/new/header.svelte';
  import { APP_THEMES, BASE_PAGE_TITLE } from '$lib/consts';
  import { SELF_BASE_URL } from '$lib/env';
  import Settings, { listenForMQLChange, loading } from '$lib/settings';
  import type { Unsubscriber } from 'svelte/store';
  import { get } from 'svelte/store';
  import { classList } from 'svelte-body';

  let unsubscribers = [] as Unsubscriber[],
    HighlightStyles: string | undefined,
    setLoadingTimer: ReturnType<typeof setTimeout> | undefined;

  const { theme } = Settings,
    skipToContent = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const content = document.getElementById('content-wrapper'),
          focusable = content?.querySelectorAll(
            '[tabindex="0"], a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
          )?.[0] as HTMLElement | null;
        focusable?.focus();
        // @ts-expect-error - scrollToOptions is not yet in the DOM typings
        focusable?.scrollTo({ behavior: 'smooth', block: 'center' });
      }
    };

  beforeNavigate((event) => {
    clearTimeout(setLoadingTimer);

    if (event.from !== event.to) {
      setLoadingTimer = setTimeout(() => loading.set(true), 50);
    }
  });

  afterNavigate(() => {
    clearTimeout(setLoadingTimer);
    loading.set(false);
  });

  onMount(() => {
    if (!browser) {
      return;
    }

    const currentTheme = get(theme);

    if (currentTheme === 'dark' && document.body.classList.contains('light')) {
      document.body.classList.remove('dark');
      theme.set('light');
    } else if (currentTheme === 'light' && document.body.classList.contains('dark')) {
      document.body.classList.remove('light');
      theme.set('dark');
    }

    unsubscribers.push(...listenForMQLChange());

    // styles for hljs codeblocks
    unsubscribers.push(
      theme.subscribe(
        async (res) =>
          (HighlightStyles =
            res === APP_THEMES.LIGHT
              ? (await import('svelte-highlight/styles/stackoverflow-light')).default
              : (await import('svelte-highlight/styles/stackoverflow-dark')).default)
      )
    );

    loading.set(false);
  });

  onDestroy(() => unsubscribers.forEach((u) => u()));

  export let data;

  $: ({ url } = $page);
</script>

<svelte:head>
  <meta name="author" content={data.config.name} />
  <meta name="theme-color" content={$theme === APP_THEMES.DARK ? '#16160e' : '#e5e4e6'} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content={BASE_PAGE_TITLE} />
  <meta property="og:url" content={url?.href} />
  <meta property="og:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
  <meta property="twitter:url" content={url?.href} />
  <meta property="twitter:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />

  <link rel="preload" href="/assets/logo-standard.webp" as="image" />

  {#if HighlightStyles}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html HighlightStyles}
  {/if}
</svelte:head>

<svelte:body use:classList={[$theme, $loading ? 'is-loading' : 'is-loaded']} />

<div class="text-dark dark:text-light mx-auto h-full w-full lg:text-lg">
  <div
    class="themed-scrollbar relative mx-auto flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll"
  >
    <Header />

    <main class="mx-auto flex w-full flex-1 px-8 py-10">
      <PageTransition pathname={data.pathname}>
        <ErrorBoundary>
          <slot />
        </ErrorBoundary>
      </PageTransition>
    </main>

    <Footer config={data.config} />
  </div>
</div>
