<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  import { isLoadingPosts, postsWritable, queryPosts } from '@/stores/posts';
  export const load: Load = async () => {
    queryPosts({ limit: 1 })
      .then((posts) => {
        postsWritable.set(posts);
      })
      .catch(() => {
        noop;
      });
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate loading
  };
</script>

<script lang="ts">
  import type { Posts } from '$lib/types';
  import { onMount, onDestroy } from 'svelte';
  import { loading } from '@/stores/theme';
  import { noop } from 'svelte/internal';

  export let posts: Posts;

  const unsubscribe = postsWritable.subscribe((res) => {
    posts = res;
  });

  onMount(() => {
    loading.set(false);
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
<p class="text-center mt-4">
  {#if $isLoadingPosts}
    <span class="font-mono font-normal text-sm uppercase">Loading...</span>
  {:else}
    <button class="text-sm font-mono uppercase hover:cursor-pointer hover:font-bold" on:click={noop}
      >Load more</button
    >
  {/if}
</p>
