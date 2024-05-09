<script lang="ts">
  import { linkTo, t } from '$lib/i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';

  export let data;
</script>

<HeadedBlock constrainWidth={false}>
  <svelte:fragment slot="heading">
    <div class="flex w-full flex-row items-center justify-between">
      <h1 class="font-display text-3xl font-black text-dark dark:text-light">
        {$t('Topics')}
      </h1>
      <ArrowButton
        href={$linkTo('/thoughts')}
        dir="left"
        placement="before"
        text={$t('All posts')}
        preload
      />
    </div>
  </svelte:fragment>

  {#if data.tags?.length}
    <div class="flex flex-col gap-5 px-8">
      {#each data.tags as tag}
        {@const posts = data.postsByTag.get(tag)}
        <a
          href={$linkTo(`/thoughts/+/${tag.slug.current}`)}
          class="focus-outline -mx-3 -my-2 flex flex-row items-center justify-between gap-x-4 border-neutral-100 px-3 py-2 transition-[border-color,color] hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
          data-sveltekit-preload-code
        >
          <h2 class="font-mono text-md text-dark dark:text-light">
            {tag.title}
          </h2>
          <span
            class="transiton-colors inline h-full w-full min-w-0 flex-1 border-b border-dashed border-neutral-200 dark:border-neutral-400"
          ></span>
          <span class="text-xs text-neutral-600 dark:text-neutral-200">
            {posts?.length ?? 0}
            {$t((posts?.length ?? 0) === 1 ? 'Post' : 'Posts').toLowerCase()}
          </span>
        </a>
      {/each}
    </div>
  {:else}
    <EmptyContent />
  {/if}
</HeadedBlock>
