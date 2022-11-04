<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import PageHeading from '$components/headings/page-heading.svelte';
  import type { PageData } from './$types';
  import { onMount, onDestroy } from 'svelte';
  import ListItem from '$components/work/list-item.svelte';
  import ErrorText from '$components/error-text.svelte';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[-_]/g, ' ');
  pageHeading.set(`Work | Tag | ${pageTitle}`);
  navOptions.set({ down: '', up: '/work' });

  let mousePos: [number, number];

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

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
      {#each projects.data as project}
        <ListItem {project} />
      {/each}
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <ErrorText text="No data" classes="w-fit" />
      </div>
    {/if}
  </div>
</div>
