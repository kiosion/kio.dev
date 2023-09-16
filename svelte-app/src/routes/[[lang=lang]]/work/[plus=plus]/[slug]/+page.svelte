<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';

  import EmptyContent from '$components/empty-content.svelte';
  import ListItem from '$components/lists/list-item.svelte';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[-_]/g, ' ');
</script>

<svelte:head>
  <title>
    kio.dev | work | {pageTitle}
  </title>
</svelte:head>

<h1 class="mb-8 mt-10 font-code text-3xl font-black">
  {$t("Recent '{tag}' projects", { tag: pageTitle })}
</h1>
{#if $page.data.projects?.length}
  <div class="mt-12 flex flex-col items-start justify-start gap-4">
    {#each $page.data.projects as project}
      <ListItem document={project} />
    {/each}
  </div>
{:else}
  <EmptyContent />
{/if}
