<script lang="ts">
    import type { Tag } from "$types/sanity";

    const { tags, tagCounts, maxTags = 5 }: { tags: Pick<Tag, '_id' | 'slug' | 'title'>[], tagCounts: Record<Tag['_id'], number>, maxTags?: number } = $props();
</script>

<div class="flex shrink flex-row flex-wrap items-center justify-start gap-2 border-t border-b border-dark dark:border-light py-4">
  {#each tags as tag, i}
    {#if i < maxTags}
      <a
        class="focus-outline-sm flex shrink-0 flex-row items-center justify-between gap-x-3 rounded-lg bg-neutral-200/50 px-2.5 py-2 text-sm whitespace-nowrap text-neutral-700 transition-colors select-none hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-800/75 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
        href={`/thoughts/+/${tag.slug?.current}`}
        data-sveltekit-preload-code
        data-sveltekit-preload-data
        aria-label={'Topic' + ': ' + tag.title}
      >
        <span class="flex flex-row items-center justify-start gap-x-1">
          <span class="font-semibold select-none">#</span>
          <span>{tag.title?.toLowerCase()}</span>
        </span>
        <span class="text-xs"
          >{tagCounts[tag._id]}
          {(tagCounts[tag._id] === 1 ? 'Post' : 'Posts').toLowerCase()}</span
        >
      </a>
    {/if}
  {/each}
</div>
