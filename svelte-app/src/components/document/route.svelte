<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte';

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

  export let model: 'post' | 'project',
    data: ProjectDocument | PostDocument | undefined,
    headings: DocumentHeadings[] | never[],
    routeFetch: RouteFetch | undefined = undefined;

  const isPost = model === 'post',
    allTags =
      (((tags: NonNullable<typeof data>['tags'] | undefined) => {
        if (!tags) {
          return undefined;
        }
        return tags.reduce((acc, tag) => {
          tag.title && acc.push(tag.title.toLowerCase());
          return acc;
        }, [] as string[]);
      })(data?.tags)?.join(', ') as string) + ', ' || '',
    scrollContainer = (getContext('getScrollContainer') as () => HTMLDivElement)(),
    updateTop = (_e?: Event) => (
      clearTimeout(timer),
      (timer = setTimeout(
        () =>
          (isAtTop =
            !pageContainer ||
            Math.floor(
              Math.round(pageContainer.getBoundingClientRect().top) -
                Math.round(pageContainer.offsetTop)
            ) >= -38),
        250
      ))
    );

  let isAtTop = true,
    timer: ReturnType<typeof setTimeout> | undefined,
    pageContainer: HTMLDivElement;

  onMount(() => {
    scrollTo($page?.url);
    updateTop();

    scrollContainer?.addEventListener('scroll', updateTop);
    scrollContainer?.addEventListener('wheel', updateTop);
  });

  onDestroy(() => {
    scrollContainer?.removeEventListener('scroll', updateTop);
    scrollContainer?.removeEventListener('wheel', updateTop);
    clearTimeout(timer);
  });

  $: $page?.url && scrollTo($page.url);
  $: pageTitle = `kio.dev${data?.title ? ` | ${data.title}` : ''}`;
  $: pageDescription = data?.desc
    ? data.desc
    : $t(`A ${isPost ? 'post' : 'project'} on kio.dev`);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="{allTags}blog, {isPost
      ? 'post, blog post'
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
  <slot name="meta" />
</svelte:head>

<div data-test-route={isPost ? 'blog' : 'work'} bind:this={pageContainer}>
  {#if data}
    <ContentWrapper>
      <Content {model} {data} {headings} {routeFetch} />
    </ContentWrapper>
  {/if}
</div>

<style lang="scss">
  div {
    @apply flex h-fit flex-row items-stretch justify-start;
  }
</style>
