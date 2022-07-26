<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  import { isLoadingPosts, postsWritable, queryPosts } from '@/stores/posts';
  export const load: Load = async () => {
    queryPosts({ limit: 2 })
      .then((posts) => {
        postsWritable.set(posts?.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
</script>

<script lang="ts">
  import type { Posts } from '$lib/types';
  import { onDestroy } from 'svelte';
  import { noop } from 'svelte/internal';
  import ListItem from '@/components/blog/list-item.svelte';

  export let posts: Posts;

  const unsubscribe = postsWritable.subscribe((res) => {
    posts = res;
    res ? isLoadingPosts.set(false) : isLoadingPosts.set(true);
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<h1 class="font-code font-bold text-4xl text-center my-8 lowercase">blog</h1>
<p class="text-center">Some placeholder text for now.</p>
<!-- <p class="text-center mt-4">
  {#if $isLoadingPosts}
    <span class="font-mono font-normal text-sm uppercase">Loading...</span>
  {:else}
    <button class="text-sm font-mono uppercase hover:cursor-pointer hover:font-bold" on:click={noop}
      >Load more</button
    >
  {/if}
</p> -->

{#if posts}
  {#each posts as post}
    <ListItem {post} />
  {/each}
{/if}
