<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  import { postsWritable as posts, findPosts } from '@/stores/posts';
  import { Diamonds } from 'svelte-loading-spinners';
  import { theme } from '@/stores/theme';

  let isLoadingData = true;
  export const load: Load = async () => {
    await findPosts({ limit: 2 })
      .then((res) => {
        posts.set(res?.data);
        isLoadingData = false;
      })
      .catch((e) => {
        console.error(e);
      });
  };
</script>

<script lang="ts">
  import ListItem from '@/components/blog/list-item.svelte';
  import { onMount } from 'svelte';

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
{:else}
  {#each $posts as post}
    <ListItem {post} />
  {/each}
{/if}
