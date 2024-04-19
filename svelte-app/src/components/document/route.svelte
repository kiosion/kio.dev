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

<Content {data} {images} {routeFetch}></Content>
