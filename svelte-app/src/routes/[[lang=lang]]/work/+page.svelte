<script lang="ts">
  import ListItem from '$components/work/list-item.svelte';
  import PageHeading from '$components/headings/page-heading.svelte';
  import { onMount } from 'svelte';
  import Features from '$stores/features';
  import ErrorText from '$components/error-text.svelte';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';
  import IconHeader from '$components/icon-header.svelte';
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import Hoverable from '$components/hoverable.svelte';
  import { RECENT_PROJECTS_COUNT } from '$lib/consts';
  import { t } from '$i18n';

  let click: UIfx;

  onMount(() => {
    setupNavigation($page?.url?.pathname);

    window?.scroll?.({ top: 0, behavior: 'smooth' });

    import('$lib/sfx')
      .then((sfx) => {
        click = sfx.click;
      })
      .catch(() => undefined);
  });

  export let data: PageData;

  const pageTitle = `kio.dev | ${t('Work').toLowerCase()}`;

  $: ({ pinned, projects } = data);
  $: CanUseSounds = Features.can('use sounds feature');
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

<div data-test-route="work" class="w-full">
  <PageHeading
    heading={t('Work')}
    text={t(
      'A collection of my work, open-source contributions, and personal projects'
    )}
  />
  <div class="mb-12">
    {#if pinned?.data}
      <IconHeader icon="Pin" text={t('Pinned')} />
      <ListItem project={pinned.data} />
    {/if}
    <IconHeader icon="Clock" text={t('Recent')} />
    {#if projects?.data?.length}
      <div
        class="w-full mt-4 flex flex-row flex-wrap items-start justify-between gap-x-3 gap-y-4"
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
    {#if projects?.meta?.total > RECENT_PROJECTS_COUNT}
      <Hoverable>
        <a
          href="/work/1"
          class="block w-fit mt-8"
          aria-label={t('View more projects')}
          on:click={() => $CanUseSounds && click?.play()}
        >
          <IconHeader icon="ArrowRight" text={t('View more')} classes="" />
        </a>
      </Hoverable>
    {/if}
  </div>
</div>
