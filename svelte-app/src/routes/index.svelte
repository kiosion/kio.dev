<script>
  import { posts, fetchPosts } from '@/stores/posts';

  let loaded = 0;
  const loadMore = () => {
    fetchPosts(loaded += 5).then(() => {
      loaded += 5;
    });
  };
  const clearList = () => {
    posts.set([]);
    loaded = 0;
  };
</script>
<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<h1 class="text-4xl text-center my-8 uppercase">Blog</h1>
<p class="text-center">Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p class="text-center mt-4">
  <a 
    href="{void 0}"
    class="hover:cursor-pointer hover:font-bold"
    on:click="{
      () => loadMore()
    }"
  >Load more</a>
  <a 
    href="{void 0}"
    class="hover:cursor-pointer hover:font-bold"
    on:click="{
      () => clearList()
    }"
  >Clear loaded</a>
</p>

{#if $posts}
  <div class="w-full mt-4">
    {#each $posts as post}
      <div class="w-fit mx-auto">
        <span class="w-fit">{post.name}</span>
      </div>
    {/each}
  </div>
{/if}
