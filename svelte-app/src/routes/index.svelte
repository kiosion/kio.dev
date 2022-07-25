<script>
  import { posts, isLoading, fetchPosts } from '@/stores/posts';

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

<h1 class="font-code font-bold text-4xl text-center my-8 lowercase">blog</h1>
<p class="text-center">Some placeholder text for now.</p>
<p class="text-center mt-4">
  {#if $isLoading}
    <span class="font-mono font-normal text-sm uppercase">Loading...</span>
  {:else}
    <button
      class="text-sm font-mono uppercase hover:cursor-pointer hover:font-bold"
      on:click={
        () => loadMore()
      }
    >Load more</button>
  {/if}
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
