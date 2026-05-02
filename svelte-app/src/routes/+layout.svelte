<script lang="ts">
  // eslint-disable-next-line no-restricted-imports
  import '../tailwind.css';
  // eslint-disable-next-line no-restricted-imports
  import '../app.scss';
  import { page } from '$app/state';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import Footer from '$components/new/footer.svelte';
  import Header from '$components/new/header.svelte';
  import { BASE_PAGE_TITLE } from '$lib/consts';
  import { SELF_BASE_URL } from '$lib/env';
  import type { Meta } from '$lib/nav.svelte';
  import HighlightDarkStyles from 'svelte-highlight/styles/stackoverflow-dark';
  import HighlightLightStyles from 'svelte-highlight/styles/stackoverflow-light';

  const lightHighlight = HighlightLightStyles.replace(
    /^<style>/i,
    '<style media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)">',
  );
  const darkHighlight = HighlightDarkStyles.replace(
    /^<style>/i,
    '<style media="(prefers-color-scheme: dark)">',
  );

  const { data, children } = $props();

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

  <meta name="author" content={data.siteConfig.name} />
  <meta name="theme-color" content="#e5e4e6" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#16160e" media="(prefers-color-scheme: dark)" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content={BASE_PAGE_TITLE} />
  <meta property="og:url" content={page.url?.href} />
  <meta property="og:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
  <meta property="twitter:url" content={page.url?.href} />
  <meta property="twitter:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />

  <link rel="preload" href="/assets/logo-standard.webp" as="image" />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html lightHighlight}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html darkHighlight}
</svelte:head>

<div
  class="bg-light text-dark dark:text-light relative mx-auto flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll dark:bg-neutral-800">
  <Header />

  <main class="mx-auto flex w-full max-w-6xl flex-1 flex-grow flex-col gap-20 px-8 py-10">
    <ErrorBoundary showError>
      {@render children()}
    </ErrorBoundary>
  </main>

  <Footer config={data.siteConfig} />
</div>
