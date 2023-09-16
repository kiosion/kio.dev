<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';

  import EmptyContent from '$components/empty-content.svelte';
  import ListItem from '$components/lists/list-item.svelte';

  export let data;

  const pageTitle = $page.params.slug.toLowerCase().replace(/[_]/g, ' ');
</script>

<svelte:head>
  <title>
    kio.dev | {$t('Blog').toLowerCase()} | {pageTitle}
  </title>
</svelte:head>

<h1 class="mb-8 mt-10 font-code text-3xl font-black">
  {$t("Recent '{tag}' posts", { tag: pageTitle })}
</h1>
{#if data.posts?.length}
  <div class="mt-12 flex flex-col items-start justify-start gap-4">
    {#each data.posts as post}
      <ListItem document={post} />
    {/each}
  </div>
{:else}
  <div class="w-full">
    <EmptyContent />
  </div>
{/if}
