<script lang="ts" context="module">
  import { posts, findPosts } from '@/stores/posts';
  import Logger from '$lib/logger';

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    await findPosts(fetch)
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        posts.set(res);
      })
      .catch((err: unknown) => {
        Logger.error(err as string, 'routes/index');
      });
  };
</script>

<script lang="ts">
  import ListItem from '@/components/blog/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';

  let mousePos: number[];

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      mousePos = [e.clientX, e.clientY];
    });
  });

  onDestroy(() => {
    document.removeEventListener('mousemove', (e) => {
      mousePos = [e.clientX, e.clientY];
    });
  });
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="index" class="w-full">
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
