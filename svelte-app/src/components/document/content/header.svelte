<script lang="ts">
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { formatDate } from '$lib/date';
  import type { GetPostQueryResult } from '$types/sanity';

  const { data }: { data: NonNullable<GetPostQueryResult> } = $props();
</script>

{#snippet tagItem(tag: NonNullable<typeof data.tags>[number])}
  <a
    class="group flex flex-row items-center justify-start gap-x-0.5"
    href={`/thoughts/+/${tag.slug?.current}`}
    data-sveltekit-preload-code
    data-sveltekit-preload-data
    aria-label={'Topic' + ': ' + tag.title}
  >
    <span class="select-none">#</span>
    <span
      class="decoration-orange-light dark:decoration-orange-dark decoration-2 underline-offset-[3px] transition-opacity group-hover:underline group-hover:opacity-100"
      >{tag.title?.toLowerCase()}</span
    >
  </a>
{/snippet}

<section class="mt-10 flex w-full flex-col gap-y-6 border-b pb-4">
  <div class="flex flex-col gap-y-4">
    <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
      {data.title}
    </h1>
    <div class="flex flex-row items-center gap-2 text-sm">
      <Tooltip content={$formatDate(data.date, 'rel') || 'Unknown date'}>
        <p class="cursor-default" aria-label="Published date">
          {$formatDate(data.date, 'full') || 'Unknown date'}
        </p>
      </Tooltip>
      <p class="text-sm">&middot;</p>
      <Tooltip content={`${(data.estimatedWordCount ?? 0).toLocaleString('en')} words`}>
        <p class="cursor-default">
          {`${data.estimatedReadingTime || 0} min read`}
        </p>
      </Tooltip>
      {#if data.tags?.length}
        <p class="text-sm">&middot;</p>
        <div class="flex flex-row flex-wrap items-center justify-start gap-2">
          {#each data.tags as tag}
            {@render tagItem(tag)}
          {/each}
        </div>
      {/if}
    </div>
  </div>
  {#if data.desc}
    <p class="max-w-prose text-base tracking-wide opacity-70">
      {data.desc}
    </p>
  {/if}
</section>
