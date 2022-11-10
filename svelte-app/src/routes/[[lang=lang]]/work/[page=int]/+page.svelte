<script lang="ts">
  import ListItem from '$components/work/list-item.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ErrorText from '$components/error-text.svelte';
  import SafeIcon from '$components/safe-icon.svelte';
  import { page } from '$app/stores';
  import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
  import Hoverable from '$components/hoverable.svelte';
  import IconHeader from '$components/icon-header.svelte';

  let curPage = 1,
    totalPages = 1;

  onMount(() => {
    pageHeading.set(`All work | Page ${curPage}`);
    navOptions.set({ down: '', up: '/work' });
  });

  export let data: PageData;

  $: projects?.meta &&
    (totalPages = Math.ceil(projects.meta.total / PAGINATION_POSTS_PER_PAGE));
  $: $page.params, (curPage = parseInt($page.params?.page));
  $: ({ projects } = data);
</script>

<svelte:head>
  <title>kio.dev | work | all work</title>
</svelte:head>

<IconHeader icon="BulletList" text="All Work" />

{#if projects?.data?.length}
  {#each projects.data as project}
    <ListItem {project} />
  {/each}
{:else}
  <ErrorText text="No data" classes="w-fit" />
{/if}

<div class="w-full flex flex-row justify-between items-center mt-4 mb-2">
  <div class="flex flex-row justify-start items-center gap-2">
    <SafeIcon icon={'List'} />
    <h3 class="font-code text-lg">Page {curPage} of {totalPages}</h3>
  </div>
  <div class="flex flex-row justify-start items-center gap-4">
    <Hoverable>
      <a href="/work/{curPage > 1 ? curPage - 1 : 1}">
        <SafeIcon icon={'ArrowLeft'} />
      </a>
    </Hoverable>
    <Hoverable>
      <a href="/work/{curPage < totalPages ? curPage + 1 : totalPages}">
        <SafeIcon icon={'ArrowRight'} />
      </a>
    </Hoverable>
  </div>
</div>
