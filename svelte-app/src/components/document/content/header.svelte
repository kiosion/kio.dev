<script lang="ts">
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { formatDate } from '$lib/date';
  import type { GetPostQueryResult } from '$types/sanity';

  export let data: NonNullable<GetPostQueryResult>;
</script>

<BaseContainer
  class="flex w-full flex-row flex-wrap justify-between gap-2 p-2 text-sm text-neutral-700 dark:text-neutral-100"
>
  <div class="flex flex-row gap-2">
    <Tooltip content={$formatDate(data.date, 'rel') || "Unknown date"}>
      <p
        class="cursor-default rounded-lg bg-neutral-200/50 px-2.5 py-2 transition-colors dark:bg-neutral-700"
        aria-label="Published date"
      >
        {$formatDate(data.date, 'full') || "Unknown date"}
      </p>
    </Tooltip>
    <Tooltip
      content={`${(data.estimatedWordCount ?? 0).toLocaleString('en')} words`}
    >
      <p
        class="cursor-default rounded-lg bg-neutral-200/50 px-2.5 py-2 transition-colors dark:bg-neutral-700"
      >
        {`${data.estimatedReadingTime || 0} min read`}
      </p>
    </Tooltip>
  </div>
  <ArrowButton
    href="/thoughts"
    dir="left"
    text="All posts"
    preload-code
    preload-data
  />
</BaseContainer>

<div
  class="rounded-xl border border-neutral-200/50 bg-neutral-100 p-2 transition-colors dark:border-neutral-500/90 dark:bg-neutral-600"
>
  <div class="w-full px-4 py-2">
    <h1
      class="font-display h-fit max-w-full py-2 text-5xl leading-[1.1] font-bold text-black transition-[color] dark:text-white"
    >
      {data.title}
    </h1>
    {#if data.desc}
      <p class="pt-3 text-base text-neutral-700 dark:text-neutral-100">{data.desc}</p>
    {/if}
  </div>

  {#if data.tags?.length}
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-3 p-2 text-sm"
      aria-label="Tags"
    >
      {#each data.tags as { slug, title }}
        <a
          class="focus-outline-sm flex flex-row gap-x-2 rounded-md bg-neutral-200/50 px-2.5 py-2 transition-colors select-none hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
          href={`/thoughts/+/${slug.current}`}
          data-sveltekit-preload-code
          data-sveltekit-preload-data
          aria-label={'Topic' + ': ' + title}
        >
          <span class="font-bold select-none">#</span>
          <span>{title.toLowerCase()}</span>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  h1 {
    overflow-wrap: break-word;
    word-break: break-word;
  }
</style>
