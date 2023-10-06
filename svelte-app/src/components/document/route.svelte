<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { page } from '$app/stores';
  import scrollTo from '$helpers/scrollTo';
  import { t } from '$i18n';
  import { BASE_PAGE_TITLE } from '$lib/consts';
  import { summaryContents } from '$lib/summary';

  import Content from '$components/document/content/content.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';

  import type {
    DocumentHeadings,
    PostDocument,
    ProjectDocument,
    RouteFetch
  } from '$types';

  export let data: ProjectDocument | PostDocument,
    model = data._type,
    headings: DocumentHeadings[] | undefined,
    routeFetch: RouteFetch | undefined = undefined;

  onMount(() => {
    headings?.length && summaryContents.set(headings);
    scrollTo($page?.url);
  });

  onDestroy(() => {
    summaryContents.set(undefined);
  });

  $: $page?.url && scrollTo($page.url);
  $: pageTitle = `${BASE_PAGE_TITLE} ~ ${data.title}`;
  $: pageDescription = data?.desc
    ? data.desc.length > 160
      ? `${data.desc.slice(0, 160 - 3)}...`
      : data.desc
    : $t(`A ${model === 'post' ? 'post' : 'project'} on kio.dev`);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta itemprop="name" content={pageTitle} />
  <meta itemprop="description" content={pageDescription} />
  <meta name="robots" content="index, nofollow" />
  <meta name="description" content={pageDescription} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content={data.title} />
  <meta property="twitter:description" content={pageDescription} />
  <meta property="article:author" content="Kio" />
  <meta
    property="article:published_time"
    content={new Date(data.date || '0')?.toISOString()}
  />
  <meta
    property="article:modified_time"
    content={new Date(data.date || '0')?.toISOString()}
  />
</svelte:head>

<ContentWrapper>
  <Content {data} {headings} {routeFetch} />
</ContentWrapper>
