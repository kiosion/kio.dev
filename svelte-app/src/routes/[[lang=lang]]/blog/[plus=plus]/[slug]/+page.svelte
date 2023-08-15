<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { navOptions, pageHeading } from '$stores/navigation';

  import EmptyContent from '$components/empty-content.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import ListItem from '$components/lists/blog-item.svelte';

  import type { PageData } from './$types';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[_]/g, ' ');
  pageHeading.set(`${$t('Blog')} | ${$t('Tag')} | ${pageTitle}`);
  navOptions.set({ down: '', up: '/blog' });

  export let data: PageData;

  $: ({ posts } = data);
</script>

<svelte:head>
  <title>
    kio.dev | {$t('Blog').toLowerCase()} | {pageTitle}
  </title>
</svelte:head>

<IconHeader icon="label" text={$t("Recent '{tag}' posts", { tag: pageTitle })} />
{#if posts?.length}
  <div class="flex flex-col gap-y-4">
    {#each posts as post}
      <ListItem {post} />
    {/each}
  </div>
{:else}
  <div class="flex w-full flex-row items-center justify-center">
    <EmptyContent />
  </div>
{/if}
