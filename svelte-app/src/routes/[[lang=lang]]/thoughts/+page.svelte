<script lang="ts">
  import { linkTo, t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import DocumentList from '$components/lists/document-list.svelte';

  import type { DocumentTags } from '$types';

  export let data;

  $: description = $t('pages.thoughts.description');

  const MAX_TAGS = 5;

  const tags: DocumentTags[] = [],
    tagCounts: Record<DocumentTags['_id'], number> = {};

  for (let i = 0; i < data.posts?.length ?? 0; i++) {
    const postTags = data.posts[i]?.tags ?? [];

    if (!postTags.length) {
      continue;
    }

    for (let j = 0; j < postTags.length; j++) {
      const tag = postTags[j];
      tagCounts[tag._id] = (tagCounts[tag._id] ?? 0) + 1;

      if (tagCounts[tag._id] === 1) {
        tags.push(tag);
      }
    }
  }

  for (let i = 1; i < tags.length; i++) {
    const currentTag = tags[i];
    const currentCount = tagCounts[currentTag._id];
    let j = i - 1;

    // Find the correct position for the currentTag
    while (
      j >= 0 &&
      (tagCounts[tags[j]._id] < currentCount ||
        (tagCounts[tags[j]._id] === currentCount &&
          tags[j].title.localeCompare(currentTag.title) > 0))
    ) {
      tags[j + 1] = tags[j];
      j--;
    }

    tags[j + 1] = currentTag;
  }
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
  <BaseContainer class="flex w-full flex-row items-start justify-between gap-4 p-2">
    <div class="flex shrink flex-row flex-wrap items-center justify-start gap-2">
      {#each tags as tag, i}
        {#if i < MAX_TAGS}
          <a
            class="focus-outline-sm flex shrink-0 select-none flex-row items-center justify-between gap-x-3 whitespace-nowrap rounded-lg bg-neutral-200/50 px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-800/75 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
            href={$linkTo(`/thoughts/+/${tag.slug.current}`)}
            data-sveltekit-preload-code
            aria-label={$t('Topic') + ': ' + tag.title}
          >
            <span class="flex flex-row items-center justify-start gap-x-1">
              <span class="select-none font-semibold">#</span>
              <span>{tag.title.toLowerCase()}</span>
            </span>
            <span class="text-xs"
              >{tagCounts[tag._id]}
              {$t(tagCounts[tag._id] === 1 ? 'Post' : 'Posts').toLowerCase()}</span
            >
          </a>
        {/if}
      {/each}
    </div>
    <ArrowButton
      href={$linkTo('/thoughts/+')}
      dir="right"
      placement="after"
      text={$t('All topics')}
      preload-code
      preload-data
    />
  </BaseContainer>

  <BaseContainer class="px-4 py-6">
    {#if data.posts.length}
      <DocumentList documents={data.posts}></DocumentList>
    {:else}
      <EmptyContent />
    {/if}
  </BaseContainer>
</div>
