<script lang="ts">
  import ListItem from '@/components/blog/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts, queryPosts } from '@/stores/posts';
  import { highlightEffects } from '@/stores/features';
  import { navOptions, pageHeading } from '@/stores/menu';
  import ErrorText from '@/components/error-text.svelte';
  // import { handleScrollNav } from '$lib/helpers/navigation';

  let mousePos: [number, number];
  // let scrollContainer: HTMLElement;

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
    <h3 class="font-code text-lg mt-4 mb-2">Pinned</h3>

    <h3 class="font-code text-lg mt-4 mb-2">Recent</h3>
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        <ListItem {post} {mousePos} />
      {/each}
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
    <div class="w-full flex flex-row items-center justify-center mt-8">
      <a href="/blog/all" class="w-fit" aria-label="View all posts">
        <h3 class="font-code text-lg w-fit" tabindex="0">View all</h3>
      </a>
    </div>
  </div>
</div>
