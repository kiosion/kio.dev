<script lang="ts">
  import ListItem from '$components/blog/list-item.svelte';
  import PageHeading from '$components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts } from '$stores/blog';
  import { highlightEffects, sounds } from '$stores/features';
  import ErrorText from '$components/error-text.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';
  import { setupNavigation } from '$helpers/navigation';
  import { page } from '$app/stores';
  import Hoverable from '$components/hoverable.svelte';

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
    // TODO: If posts store is empty, should re-fetch from API
  });

  onDestroy(() => {
    if ($highlightEffects === 'on') {
      document.removeEventListener('mousemove', () => setMousePos);
      document.removeEventListener('mouseout', () => setMousePos);
      document.removeEventListener('blur', () => setMousePos);
    }
  });

  export let data: PageData;

  $: ({ pinnedPost } = data);
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="blog" class="w-full">
  <PageHeading
    heading="Blog"
    text="Thoughts about (mostly) tech, design, and development"
  />
  <div class="pb-20">
    {#if pinnedPost?.data}
      <IconHeader icon="Pin" text="Pinned" />
      <ListItem post={pinnedPost.data} {mousePos} />
    {/if}
    <IconHeader icon="Clock" text="Recent" />
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        {#if post._id !== pinnedPost?.data?._id}
          <ListItem {post} {mousePos} />
        {/if}
      {/each}
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <ErrorText text="No data" classes="w-fit" />
      </div>
    {/if}
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
  </div>
</div>
