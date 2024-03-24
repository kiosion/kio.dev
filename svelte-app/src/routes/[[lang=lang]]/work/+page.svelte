<script lang="ts">
  import { t } from '$lib/i18n.js';
  import { pageTitle } from '$lib/navigation';

  import Timeline from '$components/about/timeline.svelte';
  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import DocumentList from '$components/lists/document-list.svelte';

  export let data;

  $: description = $t('pages.work.description');
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta content={$pageTitle} itemprop="name" />
  <meta content={description} itemprop="description" />
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta content="website" property="og:type" />
  <meta content={$pageTitle} property="og:title" />
  <meta content={description} property="og:description" />
  <meta content={$pageTitle} property="twitter:title" />
  <meta content={description} property="twitter:description" />
</svelte:head>

<HeadedBlock heading={$t("Where I've worked")}>
  {#if data.config?.timeline?.length}
    <Timeline data={data.config.timeline} />
  {:else}
    <div class="w-full">
      <EmptyContent />
    </div>
  {/if}
</HeadedBlock>

{#if data.projects.length}
  <Divider />

  <HeadedBlock heading={$t('Projects')}>
    <DocumentList documents={data.projects} />
  </HeadedBlock>
{/if}
