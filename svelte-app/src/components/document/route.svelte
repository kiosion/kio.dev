<script lang="ts">
  import { page } from '$app/state';
  import Content from '$components/document/content/content.svelte';
  import { BASE_PAGE_TITLE } from '$lib/consts';
  import { PageMeta } from '$lib/nav.svelte';
  import { scrollTo } from '$lib/navigation';
  import type { RouteFetch } from '$types';
  import type { GetPostQueryResult } from '$types/sanity';

  const {
    data,
    routeFetch
  }: {
    data: NonNullable<GetPostQueryResult>;
    routeFetch: RouteFetch;
  } = $props();

  $effect(() => page?.url && scrollTo(page.url));

  PageMeta.title = `${data.title} | ${BASE_PAGE_TITLE}`;
  PageMeta.desc = data?.desc
    ? data.desc.length > 160
      ? `${data.desc.slice(0, 160 - 3)}...`
      : data.desc
    : `A blog post on ${BASE_PAGE_TITLE}`;
</script>

<svelte:head>
  <meta name="robots" content="index, nofollow" />
  <meta
    property="article:published_time"
    content={new Date(data.date || '0')?.toISOString()}
  />
  <meta
    property="article:modified_time"
    content={new Date(data.date || '0')?.toISOString()}
  />
</svelte:head>

<Content {data} {routeFetch}></Content>
