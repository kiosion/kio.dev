<script lang="ts">
  // eslint-disable-next-line no-restricted-imports
  import '../tailwind.css';
  import { page } from '$app/state';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import Footer from '$components/footer.svelte';
  import Header from '$components/header.svelte';
  import { BASE_PAGE_TITLE } from '$lib/consts';
  import { SELF_BASE_URL } from '$lib/env';
  import type { Meta } from '$lib/nav.svelte';
  import { pageIn, pageOut } from '$lib/transitions';
  import { normalizePathname, pathnameGroupKey } from '$lib/utils';

  const { data, children } = $props();

  const meta = $derived(page.data.meta as Meta);

  // Key the page wrapper so the transition fires on real navigations but not on
  // in-page hash links. pathnameGroupKey collapses /thoughts and its /+/<tag>
  // filters into one key, so toggling a tag updates in place without a
  // transition, while list<->post and post<->post still transition.
  const transitionKey = $derived(pathnameGroupKey(normalizePathname(page.url?.pathname)));
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta property="og:title" content={meta.title} />
  <meta name="twitter:title" content={meta.title} />

  {#if meta.desc?.trim()}
    <meta name="description" content={meta.desc} />
    <meta property="og:description" content={meta.desc} />
    <meta name="twitter:description" content={meta.desc} />
  {/if}

  <meta name="author" content={data.siteConfig.name} />
  <!-- Matches --color-light / --color-dark so browser chrome tint is seamless. -->
  <meta name="theme-color" content="#f2f0ed" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#181717" media="(prefers-color-scheme: dark)" />
  <meta name="twitter:card" content="summary" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content={BASE_PAGE_TITLE} />
  <meta property="og:url" content={page.url?.href} />
  <meta property="og:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1000" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="{BASE_PAGE_TITLE} logo" />
  <meta name="twitter:url" content={page.url?.href} />
  <meta name="twitter:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />

  <link rel="canonical" href="{SELF_BASE_URL}{normalizePathname(page.url?.pathname)}" />
  <link rel="preload" href="/assets/logo-standard--small.webp" as="image" />
</svelte:head>

<div
  class="bg-light text-dark dark:text-light relative mx-auto flex min-h-dvh w-full flex-col overflow-x-hidden dark:bg-neutral-800"
>
  <Header />

  <main
    class="mx-auto grid w-full max-w-6xl flex-1 grow grid-cols-1 grid-rows-1 px-8 py-10"
  >
    {#key transitionKey}
      <div
        class="col-start-1 row-start-1 flex min-w-0 flex-col gap-18"
        in:pageIn
        out:pageOut
      >
        <ErrorBoundary showError>
          {@render children()}
        </ErrorBoundary>
      </div>
    {/key}
  </main>

  <Footer config={data.siteConfig} />
</div>
