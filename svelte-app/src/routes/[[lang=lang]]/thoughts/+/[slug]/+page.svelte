<script lang="ts">
  import { linkTo, t } from '$lib/i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import DocumentList from '$components/lists/document-list.svelte';

  export let data;
</script>

<div class="flex flex-col gap-5">
  <BaseContainer class="flex flex-row flex-wrap items-center justify-between gap-3 p-2">
    <div
      class="flex cursor-default select-none flex-row items-center gap-2 rounded-lg bg-neutral-0/75 px-2.5 py-2 text-sm dark:bg-neutral-800/75"
    >
      <span class="select-none font-bold">#</span>
      <span class="line-clamp-1">{data.tag.title.toLowerCase()}</span>
    </div>

    <ArrowButton
      href={$linkTo('/thoughts/+')}
      dir="left"
      placement="before"
      text={$t('All topics')}
      preload
    />
  </BaseContainer>

  <BaseContainer class="px-4 py-6">
    {#if data.posts?.length}
      <DocumentList documents={data.posts} />
    {:else}
      <EmptyContent />
    {/if}
  </BaseContainer>
</div>
