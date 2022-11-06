<script lang="ts">
  import DocumentWrapper from '$components/document/route/wrapper.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ScrollTo from '$helpers/scrollTo';
  import type { PageData } from './$types';

  let pageTitle = 'Blog';
  let allTags: string | undefined;

  onMount(() => {
    navOptions.set({ down: '', up: '/blog' });
    ScrollTo($page);
  });

  export let data: PageData;

  $: post?.data
    ? (pageTitle = `Blog | ${post.data?.title?.slice?.(0, 50)}`)
    : (pageTitle = 'Blog');
  $: pageTitle && pageHeading.set(pageTitle);
  $: post?.data?.tags?.length &&
    (allTags = post.data.tags.reduce(
      (acc, tag, i) =>
        i > 0
          ? `${acc}, ${tag.title.toLowerCase()}`
          : `${tag.title.toLowerCase()}`,
      ''
    ));
  $: ({ post } = data);
  $: $page && ScrollTo($page);
</script>

<svelte:head>
  <title>
    kio.dev | {pageTitle.toLowerCase()}
  </title>
  <meta
    name="description"
    content={post?.data?.desc ? post.data.desc : 'A blog post on kio.dev'}
  />
  <meta
    name="keywords"
    content="{allTags ? `${allTags}, ` : ''}blog, post, kio.dev, kio, kiosion"
  />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content="kio.dev | {pageTitle.toLowerCase()}" />
  <meta
    property="og:description"
    content={post?.data?.desc ? post.data.desc : 'A blog post on kio.dev'}
  />
  <meta property="twitter:url" content={$page.url.href} />
  <meta
    property="twitter:title"
    content="kio.dev | {pageTitle.toLowerCase()}"
  />
  <meta
    property="twitter:description"
    content={post?.data?.desc ? post.data.desc : 'A blog post on kio.dev'}
  />
</svelte:head>

<DocumentWrapper model="post" data={post?.data} />
