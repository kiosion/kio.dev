<script lang="ts">
  import { linkTo, t } from '$lib/i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import DocumentList from '$components/lists/document-list.svelte';

  export let data;
</script>

<HeadedBlock heading={data.tag.title} let:id>
  <svelte:fragment slot="heading">
    <div class="flex w-full flex-row items-center justify-between">
      <h1 class="line-clamp-1 font-mono text-md text-neutral-600 dark:text-neutral-300">
        {$t('Topic').toLowerCase()}:
        <span class="font-display text-3xl font-black text-dark dark:text-light"
          >{data.tag.title}</span
        >
      </h1>
      <ArrowButton
        href={$linkTo('/thoughts')}
        dir="left"
        placement="before"
        text={$t('All topics')}
        preload
      />
    </div>
  </svelte:fragment>

  {#if data.posts?.length}
    <DocumentList documents={data.posts} aria-labelledby="{id}-heading" />
  {:else}
    <EmptyContent />
  {/if}
</HeadedBlock>
