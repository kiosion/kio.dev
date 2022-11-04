<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import PageHeading from '$components/headings/page-heading.svelte';
  import type { PageData } from './$types';
  import ListItem from '$components/blog/list-item.svelte';
  import ErrorText from '$components/error-text.svelte';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[-_]/g, ' ');
  pageHeading.set(`Blog | Tag | ${pageTitle}`);
  navOptions.set({ down: '', up: '/blog' });

  export let data: PageData;

  $: ({ posts } = data);
</script>

<svelte:head>
  <title>
    kio.dev | blog | {pageTitle}
  </title>
</svelte:head>

<div data-test-route="tag" class="w-full">
  <PageHeading
    heading={pageTitle}
    text="Recent posts tagged with '{pageTitle}'"
  />
  <div class="pb-20">
    {#if posts?.data?.length}
      {#each posts.data as post}
        <ListItem {post} />
      {/each}
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <ErrorText text="No posts found" classes="w-fit" />
      </div>
    {/if}
  </div>
</div>
