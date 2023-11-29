<script lang="ts">
  import { pageTitle } from '$helpers/navigation';
  import { t } from '$i18n';

  import Timeline from '$components/about/timeline.svelte';
  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import YearList from '$components/lists/year-list.svelte';

  export let data;

  $: description = $t(
    'A collection of my work, open-source contributions, and personal projects'
  );
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
  {#if data.about.timeline?.length}
    <Timeline data={data.about.timeline} />
  {:else}
    <div class="w-full">
      <EmptyContent />
    </div>
  {/if}
</HeadedBlock>

<Divider />

<HeadedBlock heading={$t('Projects')}>
  {#if data.projects.length}
    <YearList documents={data.projects} />
  {:else}
    <EmptyContent />
  {/if}
</HeadedBlock>
