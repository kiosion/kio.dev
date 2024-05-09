<script lang="ts">
  import { linkTo, t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import DocumentList from '$components/lists/document-list.svelte';

  import type { DocumentTags } from '$types';

  export let data;

  $: description = $t('pages.thoughts.description');

  const MAX_TAGS = 12;

  const tags =
    data.posts?.reduce((acc, post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          acc.add(tag);
        });
      }
      return acc;
    }, new Set<DocumentTags>()) ?? new Set<DocumentTags>();
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

<HeadedBlock heading={$t('pages.thoughts.title')} let:id constrainWidth={false}>
  {#if data.posts.length}
    {#if tags.size}
      <div
        class="mb-8 flex select-none flex-row flex-wrap items-center justify-start gap-x-1.5 gap-y-2 px-8 font-mono text-base"
      >
        <span
          class="-ml-2.5 mr-1 text-2xl leading-[1.3] text-neutral-200 transition-colors dark:text-neutral-500"
          >&lpar;
        </span>
        {#each tags.values() as tag, i}
          {#if i < MAX_TAGS}
            <span class="text-lg text-neutral-400 dark:text-neutral-300">
              <a
                class="focus-outline-sm -m-2 p-2 text-base text-neutral-800 hover:text-orange-light focus-visible:text-orange-light dark:text-neutral-100 dark:hover:text-orange-light dark:focus-visible:text-orange-light"
                href={$linkTo(`/thoughts/+/${tag.slug.current}`)}
                data-sveltekit-preload-code
                aria-label={$t('Topic') + ': ' + tag.title}
              >
                {tag.title.toLowerCase()}</a
              >{#if i < MAX_TAGS && i < tags.size - 1},{/if}
            </span>
          {:else if i === MAX_TAGS}
            <span class="text-md text-neutral-800 dark:text-neutral-100">...</span>
          {/if}
        {/each}
        <span
          class="-mr-2.5 ml-1 text-2xl leading-[1.3] text-neutral-200 transition-colors dark:text-neutral-500"
        >
          &rpar;</span
        >
        <span class="inline-flex flex-1 items-center justify-between">
          <span
            class="ml-5 mr-6 block flex-1 border-b border-dashed border-neutral-200 transition-colors dark:border-neutral-400"
          ></span>
          <ArrowButton
            href={$linkTo(`/thoughts/+/`)}
            dir="right"
            placement="after"
            text={$t('All topics')}
            preload
          />
        </span>
      </div>
    {/if}

    <DocumentList documents={data.posts} aria-labelledby="{id}-heading"></DocumentList>
  {:else}
    <EmptyContent />
  {/if}
</HeadedBlock>
