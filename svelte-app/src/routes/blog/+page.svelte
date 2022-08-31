<script lang="ts">
  import ListItem from '$components/blog/list-item.svelte';
  import PageHeading from '$components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts } from '$stores/blog';
  import { highlightEffects, sounds } from '$stores/features';
  import { navOptions, pageHeading } from '$stores/nav';
  import ErrorText from '$components/error-text.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';
  import type { PixelIcon } from '$lib/types';

  const Pin = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/pin.svg').then((Icon) => Icon.default);
  const Clock = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/clock.svg').then((Icon) => Icon.default);
  const ArrowRight = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/arrow-right.svg').then((Icon) => Icon.default);

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

  navOptions.set({ down: '/work', up: '/' });
  pageHeading.set('Blog');

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
  <div class="mb-12">
    {#if pinnedPost?.data}
      <IconHeader icon={Pin} text="Pinned" />
      <ListItem post={pinnedPost.data} {mousePos} />
    {/if}
    <IconHeader icon={Clock} text="Recent" />
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        {#if post._id !== pinnedPost?.data?._id}
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
      <IconHeader icon={ArrowRight} text="View all" classes="" />
    </a>
  </div>
</div>
