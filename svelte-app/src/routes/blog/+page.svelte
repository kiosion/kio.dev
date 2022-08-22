<script lang="ts">
  import ListItem from '@/components/blog/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { posts, queryPosts } from '@/stores/posts';
  import { highlightEffects } from '@/stores/features';

  let mousePos: number[];

  onMount(() => {
    $highlightEffects === 'on' &&
      document.addEventListener('mousemove', (e) => {
        mousePos = [e.clientX, e.clientY];
      });

    // !$posts?.data?.length &&
  });

  onDestroy(() => {
    $highlightEffects === 'on' &&
      document.removeEventListener('mousemove', (e) => {
        mousePos = [e.clientX, e.clientY];
      });
  });
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="blog" class="h-full w-full">
  <PageHeading
    title="blog"
    subtitle="Thoughts & ramblings about tech, design, and development"
  />
  <div class="mt-2">
    {#if $posts?.data?.length}
      {#each $posts.data as post}
        <ListItem {post} {mousePos} />
      {/each}
    {:else}
      <p>No posts found.</p>
    {/if}
  </div>
</div>
