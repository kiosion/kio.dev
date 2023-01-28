<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { onMount } from 'svelte';
  import { setupNavigation } from '$helpers/navigation';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import type { PageData } from './$types';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });

  const pageTitle = `kio.dev | ${t('Now').toLowerCase()}`,
    description = t("What I'm up to now");

  // eslint-disable-next-line svelte/valid-compile
  export let data: PageData;
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
  <ContentWrapper>asdf</ContentWrapper>
</div>
