<script lang="ts" context="module">
  import { postsWritable as posts, findPosts } from '@/stores/posts';
  import { Diamonds } from 'svelte-loading-spinners';
  import { theme } from '@/stores/theme';
  import ListItem from '@/components/blog/list-item.svelte';
  import { onMount } from 'svelte';

  let isLoadingData = true;

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    const now = performance.now();
    await findPosts(fetch, { limit: 2 })
      .then((res) => {
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
    findPosts({ limit: 2 })
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

<h1 class="font-code font-bold text-4xl text-center my-8 lowercase">blog</h1>
<p class="text-center">Some placeholder text for now.</p>

{#if isLoadingData}
  <div class="absolute w-fit h-fit top-1/2 left-1/2 ml-24">
    <Diamonds size="38" color={$theme === 'light' ? '#1E293B' : '#F1F5F9'} />
  </div>
{:else if $posts}
  {#each $posts as post}
    <ListItem {post} />
  {/each}
{:else}
  <p class="text-center mt-4 text-base">No posts found.</p>
{/if}
