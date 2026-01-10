<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  // eslint-disable-next-line no-restricted-imports
  import '../tailwind.css';
  // eslint-disable-next-line no-restricted-imports
  import '../app.scss';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import Footer from '$components/new/footer.svelte';
  import Header from '$components/new/header.svelte';
  import { APP_THEMES, BASE_PAGE_TITLE } from '$lib/consts';
  import { SELF_BASE_URL } from '$lib/env';
  import type { Meta } from '$lib/nav.svelte';
  import { type ThemeChoice, writeThemeCookie } from '$lib/theme';
  import type { Unsubscriber } from 'svelte/store';
  import { readable } from 'svelte/store';
  import { classList } from 'svelte-body';
  import { useMediaQuery } from 'svelte-breakpoints';

  let unsubscribers = [] as Unsubscriber[],
    HighlightStyles = $state<string | undefined>();

  const { data, children } = $props();

  const prefersDark = browser
    ? useMediaQuery('(prefers-color-scheme: dark)')
    : readable(true);

  let theme = $state<ThemeChoice>(data.initialTheme);

  $effect(() => {
    if (!browser) {
      return;
    }

    // update cookie
    writeThemeCookie(theme);

    // update hljs styles
    if (theme === APP_THEMES.LIGHT) {
      import('svelte-highlight/styles/stackoverflow-light').then(
        (mod) => (HighlightStyles = mod.default),
      );
    } else {
      import('svelte-highlight/styles/stackoverflow-dark').then(
        (mod) => (HighlightStyles = mod.default),
      );
    }
  });

  onMount(() => {
    // keep theme synced with system preference
    unsubscribers.push(
      prefersDark.subscribe((m) => {
        if (theme === APP_THEMES.DARK && !m) {
          theme = APP_THEMES.LIGHT;
        } else if (theme === APP_THEMES.LIGHT && m) {
          theme = APP_THEMES.DARK;
        }
      }),
    );
  });

  onDestroy(() => unsubscribers.forEach((u) => u()));

  const meta = $derived(page.data.meta as Meta);
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta itemprop="name" content={meta.title} />
  <meta property="og:title" content={meta.title} />
  <meta property="twitter:title" content={meta.title} />

  {#if meta.desc?.trim()}
    <meta itemprop="description" content={meta.desc} />
    <meta name="description" content={meta.desc} />
    <meta property="og:description" content={meta.desc} />
    <meta property="twitter:description" content={meta.desc} />
  {/if}

  <meta name="author" content={data.config.name} />
  <meta name="theme-color" content={theme === APP_THEMES.DARK ? '#16160e' : '#e5e4e6'} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content={BASE_PAGE_TITLE} />
  <meta property="og:url" content={page.url?.href} />
  <meta property="og:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
  <meta property="twitter:url" content={page.url?.href} />
  <meta property="twitter:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />

  <link rel="preload" href="/assets/logo-standard.webp" as="image" />

  {#if HighlightStyles}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html HighlightStyles}
  {/if}
</svelte:head>

<svelte:body use:classList={[theme]} />

<div class="text-dark dark:text-light mx-auto h-full w-full lg:text-lg">
  <div
    class="themed-scrollbar relative mx-auto flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll"
  >
    <Header
      setTheme={(v) => (theme = v)}
      {theme}
      fetch={data.fetch}
      config={data.config}
      posts={data.posts}
    />

    <main
      class="bg-light dark:bg-dark mx-auto flex w-full flex-1 px-8 py-10 transition-colors"
    >
      <PageTransition>
        <ErrorBoundary showError>
          {@render children()}
        </ErrorBoundary>
      </PageTransition>
    </main>

    <Footer config={data.config} />
  </div>
</div>
