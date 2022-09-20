<script lang="ts">
  import ListItem from '$components/blog/list-item.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts } from '$stores/blog';
  import { highlightEffects, sounds } from '$stores/features';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ErrorText from '$components/error-text.svelte';
  import SafeIcon from '@/components/safe-icon.svelte';
  import { page } from '$app/stores';
  import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
  import Hoverable from '$components/hoverable.svelte';
  import type UIfx from 'uifx';
  import PageHeading from '$components/headings/page-heading.svelte';
  import IconHeader from '$components/icon-header.svelte';

  let curPage = 1,
    totalPages = 1;

  let mousePos: [number, number];
  let click: UIfx;

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });

    if ($highlightEffects === 'on') {
      document.addEventListener('mousemove', (e) => {
        setMousePos(e.clientX, e.clientY);
      });
      document.addEventListener('mouseout', () => {
        setMousePos(-1000, -1000);
      });
      document.addEventListener('blur', () => {
        setMousePos(-1000, -1000);
      });
    }
  });

  onDestroy(() => {
    if ($highlightEffects === 'on') {
      document.removeEventListener('mousemove', () => setMousePos);
      document.removeEventListener('mouseout', () => setMousePos);
      document.removeEventListener('blur', () => setMousePos);
    }
  });

  navOptions.set({ down: '', up: '/blog' });

  $: $posts.meta,
  (totalPages = Math.ceil($posts.meta.total / PAGINATION_POSTS_PER_PAGE));
  $: $page.params, (curPage = parseInt($page.params?.page));
  $: curPage, pageHeading.set(`Blog | All posts | Page ${curPage}`);
</script>

<svelte:head>
  <title>kio.dev | blog | all posts</title>
</svelte:head>

<div data-test-route="blog-all" class="w-full">
  <PageHeading
    heading="Blog"
    text="Thoughts about (mostly) tech, design, and development"
  />
  <IconHeader icon="BulletList" text="All Posts" />
  <div class="pb-20">
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        <ListItem {post} {mousePos} />
      {/each}
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}

    <div class="w-full flex flex-row justify-between items-center mt-4 mb-2">
      <div class="flex flex-row justify-start items-center gap-2">
        <SafeIcon icon={'List'} />
        <h3 class="font-code text-lg">Page {curPage} of {totalPages}</h3>
      </div>
      <div class="flex flex-row justify-start items-center gap-4">
        <Hoverable>
          <a
            href="/blog/{curPage > 1 ? curPage - 1 : 1}"
            on:click={() => $sounds === 'on' && click?.play()}
          >
            <SafeIcon icon={'ArrowLeft'} />
          </a>
        </Hoverable>
        <Hoverable>
          <a
            href="/blog/{curPage < totalPages ? curPage + 1 : totalPages}"
            on:click={() => $sounds === 'on' && click?.play()}
          >
            <SafeIcon icon={'ArrowRight'} />
          </a>
        </Hoverable>
      </div>
    </div>
  </div>
</div>
