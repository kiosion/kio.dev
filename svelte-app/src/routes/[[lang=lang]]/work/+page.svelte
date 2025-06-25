<script lang="ts">
  import { t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';

  import Timeline from '$components/about/timeline.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';

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

<div class="flex flex-col gap-5">
  <BaseContainer>
    <HeadedBlock heading={$t("Where I've worked")} first>
      {#if data.config?.timeline?.length}
        <Timeline data={data.config.timeline}></Timeline>
      {:else}
        <div class="w-full">
          <EmptyContent></EmptyContent>
        </div>
      {/if}
    </HeadedBlock>
  </BaseContainer>
</div>
