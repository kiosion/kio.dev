<script lang="ts">
  import { pageTitle } from '$helpers/navigation';
  import { t } from '$i18n';
  import { sortDocumentsByYear } from '$lib/helpers/date';

  import Timeline from '$components/about/timeline.svelte';
  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
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
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={$pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:title" content={$pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<HeadedBlock heading={$t("Where I've worked")}>
  {#if about.timeline?.length}
    <Timeline data={about.timeline} />
  {:else}
    <div class="w-full">
      <EmptyContent />
    </div>
  {/if}
</HeadedBlock>

<Divider class="!-mt-2" />

<HeadedBlock heading={$t('Projects')}>
  {#if projects.length}
    <div class="mt-8 flex flex-col gap-10">
      {#each sortedProjects as yearObj}
        <div class="flex flex-col items-start justify-start gap-y-2 md:flex-row">
          <h1 class="min-w-[6rem] font-code text-4xl font-black transition-[color]">
            {yearObj.year}
          </h1>
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
</HeadedBlock>
