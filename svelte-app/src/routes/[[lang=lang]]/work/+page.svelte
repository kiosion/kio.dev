<script lang="ts">
  import { page } from '$app/stores';
  import { pageTitle } from '$helpers/navigation';
  import { t } from '$i18n';
  import { sortDocumentsByYear } from '$lib/helpers/date';

  import NewTimeline from '$components/about/timeline.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import ListItem from '$components/lists/list-item.svelte';

  export let data;

  const sortedProjects = data.projects.length ? sortDocumentsByYear(data.projects) : [];

  $: description = $t(
    'A collection of my work, open-source contributions, and personal projects'
  );
  $: ({ about, projects } = data);
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta itemprop="name" content={$pageTitle} />
  <meta itemprop="description" content={description} />
  <meta name="description" content={description} />
  <meta name="keywords" content="work, experience, projects, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page?.url?.href} />
  <meta property="og:title" content={$pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page?.url?.href} />
  <meta property="twitter:title" content={$pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<ContentWrapper wide>
  <h1 class="mb-8 mt-10 font-code text-3xl font-black">{$t("Where I've worked")}</h1>
  {#if about.timeline?.length}
    <NewTimeline data={about.timeline} />
  {:else}
    <div class="w-full">
      <EmptyContent />
    </div>
  {/if}

  <h1 class="mb-8 mt-10 font-code text-3xl font-black">{$t('Projects & Talks')}</h1>
  {#if projects.length}
    <div class="flex flex-col gap-14">
      {#each sortedProjects as yearObj}
        <div class="flex flex-col items-start justify-start gap-y-2 md:flex-row">
          <h1 class="min-w-[6rem] font-code text-4xl font-black">{yearObj.year}</h1>
          {#if yearObj.items.length}
            <div class="ml-1 mt-2 flex flex-col items-start justify-start gap-4 md:ml-0">
              {#each yearObj.items as item}
                <ListItem document={item} />
              {/each}
            </div>
          {:else}
            <p class="p-4 font-code">{$t('No content')}</p>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="w-full">
      <EmptyContent />
    </div>
  {/if}
</ContentWrapper>
