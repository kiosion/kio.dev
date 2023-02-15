<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { onMount } from 'svelte';
  import { setupNavigation } from '$helpers/navigation';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import type { PageData } from './$types';
  import EmptyContent from '$components/empty-content.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import PageHeading from '$components/headings/page-heading.svelte';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });

  const pageTitle = `kio.dev | ${t('Now').toLowerCase()}`,
    description = t('A peek into my current adventures in tech and beyond');

  export let data: PageData;

  $: now = data?.about?.data.now;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content="About, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<div data-test-route="now">
  <ContentWrapper>
    <!-- Heading -->
    <PageHeading heading={t('Now')} text={description} />
    {#if now}
      <PortableText text={now} />
    {:else}
      <EmptyContent />
    {/if}
  </ContentWrapper>
</div>
