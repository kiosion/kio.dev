<script lang="ts" context="module">
  import { posts, findPosts } from '@/stores/posts';
  import { theme } from '@/stores/theme';
  import ListItem from '@/components/blog/list-item.svelte';
  import { onMount } from 'svelte';
  import LoaderInline from '@/components/loader/inline.svelte';
  import HeaderControls from '@/components/header-controls.svelte';

  let isLoadingData = true;
  let errorLoading = true;
  let routeFetch: (info: any, init?: any) => Promise<any>;

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    const now = performance.now();
    routeFetch = fetch;
    await findPosts(fetch, { limit: 2 })
      .then((res) => {
        if (res.error) {
          errorLoading = true;
          return;
        }
        posts.set(res?.data);
        isLoadingData = false;
      })
      .catch((e) => {
        console.error(e);
      });
    const delta = performance.now() - now;
    delta < 200 &&
      (await new Promise((resolve) => setTimeout(resolve, 200 - delta)));
  };
</script>

<script lang="ts">
  onMount(async () => {
    findPosts(routeFetch, { limit: 2 })
      .then((res) => {
        posts.set(res?.data);
        isLoadingData = false;
      })
      .catch((e) => {
        console.error(e);
      });
  });
</script>

<svelte:head>
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="index" class="w-full">
  <HeaderControls />
  <h1 class="font-code font-bold text-4xl text-center my-8 lowercase">blog</h1>
  <p class="text-center">
    My ramblings about mostly tech & network-related stuff
  </p>
  <div class="mt-2">
    {#if isLoadingData}
      <LoaderInline theme={$theme} error={errorLoading} />
    {:else if $posts}
      {#each $posts as post}
        <ListItem {post} />
      {/each}
    {:else}
      <ListItem error="No posts found." />
      <ListItem error="No posts found." />
      <ListItem error="No posts found." />
      <ListItem error="No posts found." />
      <ListItem error="No posts found." />
      <ListItem error="No posts found." />
      <ListItem error="No posts found." />
    {/if}
  </div>
</div>
