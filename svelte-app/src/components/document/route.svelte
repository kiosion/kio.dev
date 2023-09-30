<script lang="ts">
  import { onMount } from 'svelte';

  import { page } from '$app/stores';
  import scrollTo from '$helpers/scrollTo';
  import { t } from '$i18n';

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
    scrollTo($page?.url);
  });

  $: allTags =
    (data?.tags || [])
      .reduce(
        (acc, tag) => (tag.title && acc.push(tag.title.toLowerCase()), acc),
        [] as string[]
      )
      ?.join(', ') + ', ' || '';
  $: $page?.url && scrollTo($page.url);
  $: pageTitle = `kio.dev${data?.title ? ` | ${data.title}` : ''}`;
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

  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="{allTags}blog, {model === 'post'
      ? 'blog post'
      : 'project'}, kio.dev, kio, kiosion"
  />
  <meta name="author" content="Kio" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content={pageTitle} />
  <meta
    property="og:description"
    content={data?.desc ? data.desc : $t('A post on kio.dev')}
  />

  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={pageDescription} />
</svelte:head>

<ContentWrapper>
  <Content {data} {headings} {routeFetch} />
</ContentWrapper>
