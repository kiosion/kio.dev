<script lang="ts">
  import { t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';

  import Timeline from '$components/about/timeline.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import ListItem from '$components/lists/list-item.svelte';

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
  <div class="rounded-xl bg-neutral-100 dark:bg-neutral-600">
    <HeadedBlock heading={$t("Where I've worked")} first>
      {#if data.config?.timeline?.length}
        <Timeline data={data.config.timeline}></Timeline>
      {:else}
        <div class="w-full">
          <EmptyContent></EmptyContent>
        </div>
      {/if}
    </HeadedBlock>
  </div>

  {#if data.projects.length}
    <div class="rounded-xl bg-neutral-100 dark:bg-neutral-600">
      <HeadedBlock heading={$t('Projects')} constrainWidth={false} first let:id>
        <div
          class="flex flex-row flex-wrap gap-5 px-5"
          role="group"
          aria-labelledby="{id}-heading"
        >
          {#each data.projects as project}
            <ListItem document={project} lone />
          {/each}
          <!-- <DocumentList documents={data.projects}></DocumentList> -->
        </div>
      </HeadedBlock>
    </div>
  {/if}
</div>
