<script lang="ts">
  import ListItem from '$components/work/list-item.svelte';
  import { onMount } from 'svelte';
  import ErrorText from '$components/error-text.svelte';
  import type { PageData } from './$types';
  import IconHeader from '$components/headings/icon-header.svelte';
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import Hoverable from '$components/hoverable.svelte';
  import { RECENT_PROJECTS_COUNT } from '$lib/consts';
  import { t } from '$i18n';
  import SFX from '$lib/sfx';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
    window?.scroll?.({ top: 0, left: 0, behavior: 'smooth' });
  });

  export let data: PageData;

  const pageTitle = `kio.dev | ${t('Work').toLowerCase()}`;

  $: ({ pinned, projects } = data);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta
    name="description"
    content="A collection of my work, open-source contributions, and personal projects"
  />
  <meta name="keywords" content="work, projects, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content={pageTitle} />
  <meta
    property="og:description"
    content="A collection of my work, open-source contributions, and personal projects"
  />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content={pageTitle} />
  <meta
    property="twitter:description"
    content="A collection of my work, open-source contributions, and personal projects"
  />
</svelte:head>

{#if pinned?.data}
  <IconHeader icon="Pin" text={t('Pinned')} />
  <ListItem project={pinned.data} />
{/if}
<IconHeader icon="Clock" text={t('Recent')} />
{#if projects?.data?.length}
  <div
    class="w-full mt-4 flex flex-row flex-wrap items-stretch justify-between gap-x-3 gap-y-4"
  >
    {#each projects.data as project}
      {#if project._id !== pinned?.data?._id}
        <ListItem {project} />
      {/if}
    {/each}
  </div>
{:else}
  <div class="w-full flex flex-row items-center justify-center">
    <ErrorText text="No data" classes="w-fit" />
  </div>
{/if}
{#if projects?.meta?.total > RECENT_PROJECTS_COUNT}
  <Hoverable>
    <a
      href="/work/1"
      class="block w-fit mt-8"
      aria-label={t('View more projects')}
      on:click={() => SFX.click.play()}
    >
      <IconHeader icon="ArrowRight" text={t('View more')} classes="" />
    </a>
  </Hoverable>
{/if}
