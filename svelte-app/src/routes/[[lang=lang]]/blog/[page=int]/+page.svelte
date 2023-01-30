<script lang="ts">
  import ListSection from '$components/lists/blog-section.svelte';
  import { onMount } from 'svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import Icon from '$components/icon.svelte';
  import { page } from '$app/stores';
  import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
  import Hoverable from '$components/hoverable.svelte';
  import type { PageData } from './$types';
  import SFX from '$lib/sfx';
  import EmptyContent from '$components/empty-content.svelte';

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

<!-- TODO: Split pagination into its own component -->
<div class="mb-4 flex w-full flex-row items-center justify-between">
  <div class="flex flex-row items-center justify-start gap-2">
    <Icon icon={'List'} />
    <h3 class="font-code text-lg">Page {curPage} of {totalPages}</h3>
  </div>
  <div class="flex flex-row items-center justify-start gap-4">
    <Hoverable>
      <a
        href="/blog/{curPage > 1 ? curPage - 1 : 1}"
        on:click={() => SFX.click.play()}
      >
        <Icon icon={'ArrowLeft'} />
      </a>
    </Hoverable>
    <Hoverable>
      <a
        href="/blog/{curPage < totalPages ? curPage + 1 : totalPages}"
        on:click={() => SFX.click.play()}
      >
        <Icon icon={'ArrowRight'} />
      </a>
    </Hoverable>
  </div>
</div>
{#if posts?.data?.length}
  <ListSection posts={posts.data} />
{:else}
  <EmptyContent />
{/if}
