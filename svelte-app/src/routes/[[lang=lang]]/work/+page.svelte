<script lang="ts">
  import { t } from '$lib/i18n';
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
  {#if data.config?.timeline?.length}
    <Timeline data={data.config.timeline}></Timeline>
  {:else}
    <div class="w-full">
      <EmptyContent></EmptyContent>
    </div>
  {/if}
</HeadedBlock>

{#if data.projects.length}
  <Divider></Divider>

  <HeadedBlock heading={$t('Projects')}>
    <DocumentList documents={data.projects}></DocumentList>
  </HeadedBlock>
{/if}
