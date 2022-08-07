<script lang="ts" context="module">
  import { posts, findPosts } from '@/stores/posts';
  import ListItem from '@/components/blog/list-item.svelte';

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    await findPosts(fetch, { limit: 2 })
      .then((res) => {
        if (res.error) {
          return;
        }
        posts.set(res?.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="index" class="w-full">
  <h1 class="font-code font-bold text-4xl text-center my-8 lowercase">blog</h1>
  <p class="text-center">
    Ramblings about tech, design, and development (mostly)
  </p>
  <div class="mt-2">
    {#if $posts}
      {#each $posts as post}
        <ListItem {post} />
      {/each}
    {:else}
      <ListItem error="No posts found" />
    {/if}
  </div>
</div>
