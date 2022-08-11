<script lang="ts" context="module">
  import { posts, findPosts } from '@/stores/posts';
  import ListItem from '@/components/blog/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    await findPosts(fetch)
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
  <PageHeading
    title="blog"
    subtitle="Thoughts & ramblings about tech, design, and development"
  />
  <div class="mt-2">
    {#if $posts && $posts.length}
      {#each $posts as post}
        <ListItem {post} />
      {/each}
    {:else}
      <ListItem />
    {/if}
  </div>
</div>
