<script lang="ts">
  import ListItem from '@/components/blog/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts, queryPosts } from '@/stores/posts';
  import { highlightEffects } from '@/stores/features';
  import { navOptions, pageHeading } from '@/stores/menu';
  import ErrorText from '@/components/error-text.svelte';
  import Pin from 'pixelarticons/svg/pin.svg';
  import Clock from 'pixelarticons/svg/clock.svg';
  import ArrowRight from 'pixelarticons/svg/arrow-right.svg';

  let mousePos: [number, number];

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

  onMount(() => {
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
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="blog" class="h-fit w-full">
  <PageHeading
    heading="Thoughts & ramblings about tech, design, and development"
  />
  <div class="mb-12">
    <div class="flex flex-row justify-start align-center gap-2 mt-4 mb-2">
      <Pin width="20" />
      <h3 class="font-code text-lg">Pinned</h3>
    </div>
    <div class="flex flex-row justify-start align-center gap-2 mt-4 mb-2">
      <Clock width="20" />
      <h3 class="font-code text-lg">Recent</h3>
    </div>
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        <ListItem {post} {mousePos} />
      {/each}
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
    <a href="/blog/all" class="w-fit" aria-label="View all posts">
      <div class="flex flex-row items-center justify-start gap-2 mt-8">
        <ArrowRight width="20" />
        <h3 class="font-code text-lg w-fit" tabindex="0">View all</h3>
      </div>
    </a>
  </div>
</div>
