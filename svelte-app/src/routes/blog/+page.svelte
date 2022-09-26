<script lang="ts">
  import ListItem from '$components/blog/list-item.svelte';
  import PageHeading from '$components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects, sounds } from '$stores/features';
  import ErrorText from '$components/error-text.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';
  import { setupNavigation } from '$helpers/navigation';
  import { page } from '$app/stores';
  import Hoverable from '$components/hoverable.svelte';
  import { RECENT_POSTS_COUNT } from '$lib/consts';

  let mousePos: [number, number];

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

  let click: UIfx;

  onMount(() => {
    setupNavigation($page?.url?.pathname);

    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });

    if ($highlightEffects === 'on') {
      document.addEventListener('mousemove', (e) =>
        setMousePos(e.clientX, e.clientY)
      );
      document.addEventListener('mouseout', () => setMousePos(-1000, -1000));
      document.addEventListener('blur', () => setMousePos(-1000, -1000));
    }
  });

  onDestroy(() => {
    if ($highlightEffects === 'on') {
      document.removeEventListener('mousemove', () => setMousePos);
      document.removeEventListener('mouseout', () => setMousePos);
      document.removeEventListener('blur', () => setMousePos);
    }
  });

  export let data: PageData;

  $: ({ pinned, posts } = data);
</script>

<svelte:head>
  <title>kio.dev | blog</title>
  <meta
    name="description"
    content="Thoughts about (mostly) teach, design, and development"
  />
  <meta name="keywords" content="blog, posts, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kio.dev/blog" />
  <meta property="og:title" content="kio.dev | blog" />
  <meta
    property="og:description"
    content="Thoughts about (mostly) teach, design, and development"
  />
  <meta property="twitter:url" content="https://kio.dev/blog" />
  <meta property="twitter:title" content="kio.dev | blog" />
  <meta
    property="twitter:description"
    content="Thoughts about (mostly) teach, design, and development"
  />
</svelte:head>

<div data-test-route="blog" class="w-full">
  <PageHeading
    heading="Blog"
    text="Thoughts about (mostly) tech, design, and development"
  />
  <div class="pb-20">
    {#if pinned?.data}
      <IconHeader icon="Pin" text="Pinned" />
      <ListItem post={pinned.data} {mousePos} />
    {/if}
    <IconHeader icon="Clock" text="Recent" />
    {#if posts?.data?.length}
      {#each posts.data as post}
        {#if post._id !== pinned?.data?._id}
          <ListItem {post} {mousePos} />
        {/if}
      {/each}
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <ErrorText text="No data" classes="w-fit" />
      </div>
    {/if}
    {#if posts?.meta?.total > RECENT_POSTS_COUNT}
      <Hoverable>
        <a
          href="/blog/1"
          class="block w-fit mt-8"
          aria-label="View all posts"
          on:click={() => $sounds === 'on' && click?.play()}
        >
          <IconHeader icon="ArrowRight" text="View all" classes="" />
        </a>
      </Hoverable>
    {/if}
  </div>
</div>
