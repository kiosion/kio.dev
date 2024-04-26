<script lang="ts">
  import { t } from '$lib/i18n.js';
  import { pageTitle } from '$lib/navigation';

  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import DocumentList from '$components/lists/document-list.svelte';

  export let data;

  $: description = $t('pages.thoughts.description');

  // const stubTags = [
  //   { name: 'Elixir', slug: 'elixir', hex: 'a62c2c' },
  //   { name: 'JavaScript', slug: 'javascript', hex: 'f0db4f' },
  //   { name: 'Svelte', slug: 'svelte', hex: 'ff3e00' },
  //   { name: 'TypeScript', slug: 'typescript', hex: '007acc' },
  //   { name: 'Web Development', slug: 'web-development', hex: 'f0db4f' }
  // ];
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

<!-- <HeadedBlock heading="Topics">
  <div
    class="inline-flex flex-row flex-wrap items-center justify-start gap-x-0.5 font-mono text-base"
  >
    <span class="text-neutral-600 dark:text-neutral-300">[ </span>
    {#each stubTags as tag, i}
      <span class="text-neutral-600 dark:text-neutral-300">
        <a
          href={$linkTo(`/thoughts/+/${tag.slug}`)}
          class="text-black transition-colors hover:text-orange-light focus-visible:text-orange-light dark:text-white dark:hover:text-orange-light dark:focus-visible:text-orange-light"
        >
          '{tag.name.toLowerCase()}'</a
        >{#if i < stubTags.length - 1},{/if}
      </span>
    {/each}
    <span class="text-neutral-600 dark:text-neutral-300"> ]</span>
  </div>
</HeadedBlock> -->

<HeadedBlock heading={$t('pages.thoughts.title')} let:id>
  {#if data.posts.length}
    <DocumentList documents={data.posts} aria-labelledby="{id}-heading"></DocumentList>
  {:else}
    <EmptyContent></EmptyContent>
  {/if}
</HeadedBlock>
