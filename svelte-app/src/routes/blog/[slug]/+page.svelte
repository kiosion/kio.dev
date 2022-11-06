<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import PostContent from '$components/blog/post-content.svelte';
  import PostSidebar from '$components/blog/post-sidebar.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ScrollTo from '$helpers/scrollTo';
  import { sidebarOpen } from '$stores/navigation';
  import type { PageData } from './$types';
  import Hoverable from '$components/hoverable.svelte';
  import SafeIcon from '$components/safe-icon.svelte';
  import Features from '$stores/features';
  import type UIfx from 'uifx';

  let pageTitle = 'Blog';
  let allTags: string | undefined;
  let wrapperParent: HTMLDivElement;
  let click: UIfx;

  onMount(() => {
    navOptions.set({ down: '', up: '/blog' });
    ScrollTo($page);
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
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
  $: CanUseSounds = Features.can('use sounds feature');
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

<div
  class="flex flex-row items-stretch justify-start translate-y-14 h-fit"
  data-test-route="post"
  bind:this={wrapperParent}
>
  <Hoverable>
    <div
      class="sticky self-start w-0 top-12 xl:-translate-x-[4px] 2xl:translate-x-0"
    >
      <button
        class="flex flex-row items-center justify-start text-base font-code"
        aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        on:click={() => {
          $CanUseSounds && click?.play();
          sidebarOpen.set(!$sidebarOpen);
        }}
        on:keydown={(e) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            $CanUseSounds && click?.play();
            sidebarOpen.set(!$sidebarOpen);
          }
        }}
      >
        <SafeIcon icon={$sidebarOpen ? 'BookOpen' : 'Book'} />
        <p class="ml-4">{$sidebarOpen ? 'Hide' : 'Show'}</p>
      </button>
    </div>
  </Hoverable>
  {#if post?.data}
    <PostSidebar
      post={post.data}
      show={$sidebarOpen}
      on:toggleSidebar={() => sidebarOpen.set(!$sidebarOpen)}
    />
    <ContentWrapper sidebarOpen={$sidebarOpen}>
      <PostContent post={post.data} showingSidebar={$sidebarOpen} />
    </ContentWrapper>
  {/if}
</div>
