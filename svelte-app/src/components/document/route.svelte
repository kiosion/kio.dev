<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { page } from '$app/stores';
  import { BASE_PAGE_TITLE } from '$lib/consts';
  import { t } from '$lib/i18n';
  import { scrollTo } from '$lib/navigation';

  import Content from '$components/document/content/content.svelte';

  import type { PostDocument, ProjectDocument, ProjectImage, RouteFetch } from '$types';
  import type { Unsubscriber } from 'svelte/store';

  export let data: ProjectDocument | PostDocument,
    routeFetch: RouteFetch | undefined = undefined,
    model = data._type,
    images: ProjectImage[] | undefined = undefined;

  let pageUnsubscriber: Unsubscriber;

  onMount(() => {
    scrollTo($page?.url);

    pageUnsubscriber = page.subscribe((state) => {
      state?.url && scrollTo(state.url);
    });
  });

  onDestroy(() => {
    pageUnsubscriber?.();
  });

  $: $page?.url && scrollTo($page.url);
  $: pageTitle = `${data.title} | ${BASE_PAGE_TITLE}`;
  $: pageDescription = data?.desc
    ? data.desc.length > 160
      ? `${data.desc.slice(0, 160 - 3)}...`
      : data.desc
    : $t(`A ${model === 'post' ? 'blog post' : 'project'} on kio.dev`);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta content={pageTitle} itemprop="name" />
  <meta content={pageDescription} itemprop="description" />
  <meta name="robots" content="index, nofollow" />
  <meta name="description" content={pageDescription} />
  <meta content="article" property="og:type" />
  <meta content={pageTitle} property="og:title" />
  <meta content={pageDescription} property="og:description" />
  <meta content="summary_large_image" property="twitter:card" />
  <meta content={data.title} property="twitter:title" />
  <meta content={pageDescription} property="twitter:description" />
  <meta content="Kio" property="article:author" />
  <meta
    content={new Date(data.date || '0')?.toISOString()}
    property="article:published_time"
  />
  <meta
    content={new Date(data.date || '0')?.toISOString()}
    property="article:modified_time"
  />
</svelte:head>

<Content {data} {images} {routeFetch} />
