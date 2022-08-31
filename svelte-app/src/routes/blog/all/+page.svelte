<script lang="ts">
  import ListItem from '$components/blog/list-item.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts } from '$stores/blog';
  import { highlightEffects } from '$stores/features';
  import { navOptions, pageHeading } from '$stores/nav';
  import ErrorText from '$components/error-text.svelte';
  import SafeIcon from '@/components/safe-icon.svelte';

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
  });

  onDestroy(() => {
    if ($highlightEffects === 'on') {
      document.removeEventListener('mousemove', () => setMousePos);
      document.removeEventListener('mouseout', () => setMousePos);
      document.removeEventListener('blur', () => setMousePos);
    }
  });

  navOptions.set({ down: '', up: '/blog' });
  pageHeading.set('Blog | All posts');
</script>

<svelte:head>
  <title>kio.dev | blog | all posts</title>
</svelte:head>

<div data-test-route="blog-all" class="h-fit w-full">
  <div class="mt-14 mb-12">
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        <ListItem {post} {mousePos} />
      {/each}
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
    <!-- To-be pagination component: -->
    <div class="w-full flex flex-row justify-between items-center mt-4 mb-2">
      <div class="flex flex-row justify-start items-center gap-2">
        <SafeIcon icon={'List'} />
        <h3 class="font-code text-lg">Page 1 of 1</h3>
      </div>
      <div class="flex flex-row justify-start items-center gap-4">
        <SafeIcon icon={'ArrowLeft'} />
        <SafeIcon icon={'ArrowRight'} />
      </div>
    </div>
  </div>
</div>
