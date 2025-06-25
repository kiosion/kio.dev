<script lang="ts">
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import { linkTo, t } from '$lib/i18n';

  export let data;
</script>

<div class="flex flex-col gap-5">
  <BaseContainer
    class="flex flex-row items-center justify-between gap-3 p-2 text-sm text-neutral-700 dark:text-neutral-100"
  >
    <p
      class="cursor-default rounded-lg bg-neutral-200/75 px-2.5 py-2 text-sm transition-colors dark:bg-neutral-800/75"
    >
      {data.tags?.length ?? 0}
      {$t('Topics').toLowerCase()}
    </p>
    <ArrowButton
      href={$linkTo('/thoughts')}
      dir="left"
      placement="before"
      text={$t('All posts')}
      preload
    />
  </BaseContainer>

  <BaseContainer>
    <HeadedBlock heading={$t('Topics')} constrainWidth={false} first>
      {#if data.tags?.length}
        <div class="flex flex-col gap-5 px-8 pt-3">
          {#each data.tags as tag}
            {@const posts = data.postsByTag[tag._id]}
            <a
              href={$linkTo(`/thoughts/+/${tag.slug.current}`)}
              class="pointer-cursor focus-outline group -mx-3 -my-2 flex flex-row items-center justify-between gap-x-4 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-200/50 focus-visible:bg-neutral-200/50 dark:hover:bg-neutral-800/75 dark:focus-visible:bg-neutral-800/75"
              data-sveltekit-preload-code
              data-sveltekit-preload-data
            >
              <h2
                class="font-mono text-md text-neutral-800 transition-colors group-hover:italic group-hover:text-neutral-900 group-focus-visible:italic group-focus-visible:text-neutral-900 dark:text-neutral-100 group-hover:dark:text-neutral-0 group-focus-visible:dark:text-neutral-0"
              >
                {tag.title}
              </h2>
              <span
                class="transiton-all inline h-full w-full min-w-0 flex-1 border-b border-dashed border-neutral-200 dark:border-neutral-400"
              ></span>
              <span class="text-sm text-neutral-500 dark:text-neutral-200">
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
  </BaseContainer>
</div>
