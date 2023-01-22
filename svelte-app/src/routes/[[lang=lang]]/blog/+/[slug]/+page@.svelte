<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import PageHeading from '$components/headings/page-heading.svelte';
  import type { PageData } from './$types';
  import ListItem from '$components/lists/blog-item.svelte';
  import { t } from '$i18n';
  import EmptyContent from '$components/empty-content.svelte';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[_]/g, ' ');
  pageHeading.set(`${t('Blog')} | ${t('Tag')} | ${pageTitle}`);
  navOptions.set({ down: '', up: '/blog' });

  export let data: PageData;

  $: ({ posts } = data);
</script>

<svelte:head>
  <title>
    kio.dev | {t('Blog').toLowerCase()} | {pageTitle}
  </title>
</svelte:head>

<div data-test-route="tag" class="w-full">
  <PageHeading
    heading={pageTitle}
    text={`${t('Recent posts tagged with')} '${pageTitle}'`}
  />
  <div class="pb-20">
    {#if posts?.data?.length}
      {#each posts.data as post}
        <ListItem {post} />
      {/each}
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <EmptyContent />
      </div>
    {/if}
  </div>
</div>
