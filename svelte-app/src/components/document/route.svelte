<script lang="ts">
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import Content from '$components/document/content/content.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ScrollTo from '$helpers/scrollTo';
  import type {
    PostDocument,
    ProjectDocument,
    ResDataMany,
    Comment
  } from '$types';
  import type { Heading } from '$helpers/pt';
  import { t } from '$lib/helpers/i18n';

  export let model: 'post' | 'project',
    data: ProjectDocument | PostDocument | undefined,
    headings: Heading[],
    comments: ResDataMany<Comment> | undefined = undefined;

  const isPost = model === 'post',
    pageName = `${isPost ? t('Blog') : t('Work')}${
      data?.title ? ` | ${data.title}` : ''
    }`,
    pageTitle = `kio.dev${data?.title ? ` | ${data.title}` : ''}`,
    pageDescription = data?.desc
      ? data.desc
      : t(`A ${isPost ? 'blog post' : 'project'} on kio.dev`),
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
    pageHeading.set(pageName);
    ScrollTo($page);
  });

  $: $page && ScrollTo($page);
  $: comments ??= { data: [], meta: {} } as ResDataMany<Comment>;
</script>

<svelte:head>
  <title>{pageTitle}</title>
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
  <meta property="og:title" content={pageTitle} />
  <meta
    property="og:description"
    content={data?.desc ? data.desc : t('A blog post on kio.dev')}
  />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={pageDescription} />
  <slot name="meta" />
</svelte:head>

<div
  class="flex flex-row items-stretch justify-start h-fit"
  data-test-route={isPost ? 'blog' : 'work'}
>
  {#if data}
    <ContentWrapper>
      <Content {model} {data} {headings} {comments} />
    </ContentWrapper>
  {/if}
</div>
