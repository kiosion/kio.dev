<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import IconHeader from '$components/headings/icon-header.svelte';
  import type { PageData } from './$types';
  import ListSection from '$components/lists/blog-section.svelte';
  // import ListItem from '$components/lists/blog-item.svelte';
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
  <IconHeader
    icon="label"
    text={t("Recent '{tag}' posts", { tag: pageTitle })}
    classNames="mb-4"
  />
  <div class="pb-20">
    {#if posts?.data?.length}
      <ListSection posts={posts.data} />
    {:else}
      <div class="flex w-full flex-row items-center justify-center">
        <EmptyContent />
      </div>
    {/if}
  </div>
</div>
