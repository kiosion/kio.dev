<script lang="ts">
  import ListItem from '$components/blog/list-item.svelte';
  import { onMount } from 'svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ErrorText from '$components/error-text.svelte';
  import SafeIcon from '$components/safe-icon.svelte';
  import { page } from '$app/stores';
  import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
  import Hoverable from '$components/hoverable.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import { Boundary } from '$lib/error-bound';
  import type { PageData } from './$types';
  import SFX from '$lib/sfx';

  let curPage = 1,
    totalPages = 1;

  onMount(() => {
    pageHeading.set(`All posts | Page ${curPage}`);
    navOptions.set({ down: '', up: '/blog' });
  });

  export let data: PageData;

  $: posts?.meta &&
    (totalPages = Math.ceil(posts.meta?.total / PAGINATION_POSTS_PER_PAGE));
  $: $page.params, (curPage = parseInt($page.params?.page));
  $: ({ posts } = data);
</script>

<svelte:head>
  <title>kio.dev | blog | all posts</title>
</svelte:head>

<IconHeader icon="BulletList" text="All Posts" />
<Boundary onError={console.error}>
  {#if posts?.data?.length}
    {#each posts.data as post}
      <ListItem {post} />
    {/each}
  {:else}
    <ErrorText text="No data" classes="w-fit" />
  {/if}
</Boundary>
<!-- Pagination, TODO: Split this into its own component -->
<div class="w-full flex flex-row justify-between items-center mt-4 mb-2">
  <div class="flex flex-row justify-start items-center gap-2">
    <SafeIcon icon={'List'} />
    <h3 class="font-code text-lg">Page {curPage} of {totalPages}</h3>
  </div>
  <div class="flex flex-row justify-start items-center gap-4">
    <Hoverable>
      <a
        href="/blog/{curPage > 1 ? curPage - 1 : 1}"
        on:click={() => SFX.click.play()}
      >
        <SafeIcon icon={'ArrowLeft'} />
      </a>
    </Hoverable>
    <Hoverable>
      <a
        href="/blog/{curPage < totalPages ? curPage + 1 : totalPages}"
        on:click={() => SFX.click.play()}
      >
        <SafeIcon icon={'ArrowRight'} />
      </a>
    </Hoverable>
  </div>
</div>
