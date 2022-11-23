<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import Content from '$components/document/content/content.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ScrollTo from '$helpers/scrollTo';
  import type { PostDocument, ProjectDocument } from '$lib/types';
  import type { Heading } from '$helpers/pt';

  export let model: 'post' | 'project';
  export let data: ProjectDocument | PostDocument | undefined;
  export let headings: Heading[];

  const isPost = model === 'post',
    pageTitle = `${isPost ? 'Blog' : 'Work'}${
      data?.title ? ` | ${data.title}` : ''
    }`,
    pageDescription = data?.desc
      ? data.desc
      : `A ${isPost ? 'blog post' : 'project'} on kio.dev`,
    allTags =
      (((tags: PostDocument['tags'] | ProjectDocument['tags'] | undefined) => {
        if (!tags) {
          return undefined;
        }
        return tags.reduce((acc, tag) => {
          tag.title && acc.push(tag.title.toLowerCase());
          return acc;
        }, [] as string[]);
      })(data?.tags)?.join(', ') as string) + ', ' || '';

  onMount(() => {
    navOptions.set({ down: '', up: isPost ? '/blog' : '/work' });
    pageHeading.set(pageTitle);
    ScrollTo($page);
  });

  $: $page && ScrollTo($page);
</script>

<svelte:head>
  <title>
    kio.dev | {pageTitle.toLowerCase()}
  </title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="{allTags}blog, {isPost
      ? 'post'
      : 'project'}, kio.dev, kio, kiosion"
  />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content="kio.dev | {pageTitle.toLowerCase()}" />
  <meta
    property="og:description"
    content={data?.desc ? data.desc : 'A blog post on kio.dev'}
  />
  <meta property="twitter:url" content={$page.url.href} />
  <meta
    property="twitter:title"
    content="kio.dev | {pageTitle.toLowerCase()}"
  />
  <meta property="twitter:description" content={pageDescription} />
  <slot name="meta" />
</svelte:head>

<div
  class="flex flex-row items-stretch justify-start h-fit"
  data-test-route={isPost ? 'blog' : 'work'}
>
  {#if data}
    <ContentWrapper>
      <Content {model} {data} {headings} />
    </ContentWrapper>
  {/if}
</div>
