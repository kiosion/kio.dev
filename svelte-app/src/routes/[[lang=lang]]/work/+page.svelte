<script lang="ts">
  import { onMount } from 'svelte';

  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import { t } from '$i18n';

  import Timeline from '$components/about/timeline.svelte';
  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import ListItem from '$components/lists/project-item.svelte';

  import type { PageData } from './$types';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });

  export let data: PageData;

  const pageTitle = `kio.dev | ${$t('My work')}`,
    description = $t(
      'A collection of my work, open-source contributions, and personal projects'
    );

  $: ({ about, pinned, projects } = data);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content="work, projects, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page?.url?.href} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page?.url?.href} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<IconHeader icon="briefcase" text={$t("Where I've worked")} />
<div class="ml-2 w-full max-w-[42rem]">
  <Timeline data={about?.timeline} />
</div>

<IconHeader icon="bulletlist" text={$t("What I've worked on")} />
{#if pinned}
  <div class="mt-4">
    <ListItem project={pinned} />
  </div>

  <Divider />
{/if}
{#if projects?.length}
  <div
    class="mt-6 flex w-full flex-row flex-wrap items-stretch justify-between gap-x-3 gap-y-6"
  >
    {#each projects as project}
      {#if project._id !== pinned?._id}
        <ListItem {project} />
      {/if}
    {/each}
  </div>
{:else}
  <div class="flex w-full flex-row items-center justify-center">
    <EmptyContent />
  </div>
{/if}
