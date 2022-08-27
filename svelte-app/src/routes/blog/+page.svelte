<script lang="ts">
  import ListItem from '@/components/blog/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts } from '@/stores/posts';
  import { highlightEffects, sounds } from '@/stores/features';
  import { navOptions, pageHeading } from '@/stores/menu';
  import ErrorText from '@/components/error-text.svelte';
  import Pin from 'pixelarticons/svg/pin.svg';
  import Clock from 'pixelarticons/svg/clock.svg';
  import ArrowRight from 'pixelarticons/svg/arrow-right.svg';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';

  let mousePos: [number, number];

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

  let click: UIfx;

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
    // TODO: If posts store is empty, should re-fetch from API
  });

  onDestroy(() => {
    if ($highlightEffects === 'on') {
      document.removeEventListener('mousemove', () => setMousePos);
      document.removeEventListener('mouseout', () => setMousePos);
      document.removeEventListener('blur', () => setMousePos);
    }
  });

  navOptions.set({ down: '/work', up: '/' });
  pageHeading.set('Blog');

  export let data: PageData;
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="blog" class="h-fit w-full">
  <PageHeading
    heading="Thoughts & ramblings about tech, design, and development"
  />
  <div class="mb-12">
    {#if data.pinnedPost}
      <div class="flex flex-row justify-start items-center gap-2 mt-8 mb-2">
        <Pin width="20" />
        <h3 class="font-code text-lg">Pinned</h3>
      </div>
      <ListItem post={data.pinnedPost.data} {mousePos} />
    {/if}
    <div class="flex flex-row justify-start items-center gap-2 mt-8 mb-2">
      <Clock width="20" />
      <h3 class="font-code text-lg">Recent</h3>
    </div>
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        {#if post._id !== data.pinnedPost?.data?._id}
          <ListItem {post} {mousePos} />
        {/if}
      {/each}
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
    <a
      href="/blog/all"
      class="block w-fit mt-8"
      aria-label="View all posts"
      on:click={() => $sounds === 'on' && click?.play()}
    >
      <div class="flex flex-row items-center justify-start gap-2">
        <ArrowRight width="20" />
        <h3 class="font-code text-lg w-fit">View all</h3>
      </div>
    </a>
  </div>
</div>
