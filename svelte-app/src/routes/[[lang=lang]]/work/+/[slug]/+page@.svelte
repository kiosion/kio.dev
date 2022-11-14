<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import PageHeading from '$components/headings/page-heading.svelte';
  import type { PageData } from './$types';
  import ListItem from '$components/work/list-item.svelte';
  import ErrorText from '$components/error-text.svelte';

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
  <PageHeading
    heading={pageTitle}
    text="Recent work tagged with '{pageTitle}'"
  />
  <div class="pb-20">
    {#if projects?.data?.length}
      <div
        class="w-full mt-4 flex flex-row flex-wrap items-stretch justify-between gap-x-3 gap-y-4"
      >
        {#each projects.data as project}
          <ListItem {project} />
        {/each}
      </div>
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <ErrorText text="No data" classes="w-fit" />
      </div>
    {/if}
  </div>
</div>
