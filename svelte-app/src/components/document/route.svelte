<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import Sidebar from '$components/document/sidebar.svelte';
  import ContentWrapper from '$components/content-wrapper.svelte';
  import SafeIcon from '$components/safe-icon.svelte';
  import { sidebarOpen } from '$stores/navigation';
  import Features from '$stores/features';
  import Content from '$components/document/content/content.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ScrollTo from '$helpers/scrollTo';
  import type { PostDocument, ProjectDocument } from '$lib/types';
  import type { Heading } from '$helpers/pt';

  let click = import('$lib/sfx').then((sfx) => sfx.click);

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
      ((tags: PostDocument['tags'] | ProjectDocument['tags'] | undefined) => {
        if (!tags) {
          return undefined;
        }
        return tags.reduce((acc, tag) => {
          tag.title && acc.push(tag.title.toLowerCase());
          return acc;
        }, [] as string[]);
      })(data?.tags)?.join(', ') + ', ' || '';

  onMount(() => {
    navOptions.set({ down: '', up: isPost ? '/blog' : '/work' });
    pageHeading.set(pageTitle);
    ScrollTo($page);
  });

  $: CanUseSounds = Features.can('use sounds feature');
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
  class="flex flex-row items-stretch justify-start translate-y-14 h-fit"
  data-test-route={isPost ? 'blog' : 'work'}
>
  {#if data}
    <Hoverable>
      <div
        class="sticky self-start w-0 top-12 xl:-translate-x-[4px] 2xl:translate-x-0"
      >
        <button
          class="flex flex-row items-center justify-start text-base font-code"
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          on:click={() => {
            $CanUseSounds && click.then((c) => c.play());
            sidebarOpen.set(!$sidebarOpen);
          }}
          on:keydown={(e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
              $CanUseSounds && click.then((c) => c.play());
              sidebarOpen.set(!$sidebarOpen);
            }
          }}
        >
          <SafeIcon icon={$sidebarOpen ? 'BookOpen' : 'Book'} />
          <p class="ml-4">{$sidebarOpen ? 'Hide' : 'Show'}</p>
        </button>
      </div>
    </Hoverable>
    <Sidebar {headings} show={$sidebarOpen} />
    <ContentWrapper>
      <Content {model} {data} />
    </ContentWrapper>
  {/if}
</div>
