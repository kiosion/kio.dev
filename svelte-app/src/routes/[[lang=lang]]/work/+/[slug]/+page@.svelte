<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import type { PageData } from './$types';
  import ListItem from '$components/lists/project-item.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import { t } from '$i18n';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[-_]/g, ' ');
  pageHeading.set(`Work | Tag | ${pageTitle}`);
  navOptions.set({ down: '', up: '/work' });

  export let data: PageData;

  $: ({ projects } = data);
</script>

<svelte:head>
  <title>
    kio.dev | work | {pageTitle}
  </title>
</svelte:head>

<div data-test-route="tag" class="w-full">
  <IconHeader
    icon="label"
    text={t("Recent '{tag}' work", { tag: pageTitle })}
    classNames="mb-4"
  />
  <div class="pb-20">
    {#if projects?.data?.length}
      <div
        class="mt-4 flex w-full flex-row flex-wrap items-stretch justify-between gap-x-3 gap-y-4"
      >
        {#each projects.data as project}
          <ListItem {project} />
        {/each}
      </div>
    {:else}
      <div class="flex w-full flex-row items-center justify-center">
        <EmptyContent />
      </div>
    {/if}
  </div>
</div>
