<script lang="ts">
  import TimelineItem from '$components/about/timeline-item.svelte';
  import { displayMonthDuration, displayRange } from '$lib/date';
  import { t } from '$lib/i18n';
  import type { GetConfigQueryResult } from '$types/sanity';

  type WorkTimelineItem = NonNullable<
    NonNullable<GetConfigQueryResult>['timeline']
  >[number];

  export let section: NonNullable<WorkTimelineItem>[];

  const title = section[0].title,
    id = Math.random().toString(36).substring(7);
</script>

<section
  class="my-5 rounded-lg bg-neutral-200/50 px-5 pt-3 pb-6 transition-colors dark:bg-neutral-700"
  role="group"
  aria-labelledby="{id}-heading"
>
  <div class="pb-3">
    <h2
      class="text-dark text-xl font-bold transition-colors dark:text-white"
      id="{id}-heading"
    >
      {title}
    </h2>
    <p
      class="inline-flex flex-row items-center justify-start gap-x-2 font-sans text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
      aria-label={$t('Duration')}
    >
      <span
        >{$displayRange(
          section[section.length - 1].range?.start,
          section[0].range?.end
        )}</span
      ><span>&bull;</span>
      <span
        >{$displayMonthDuration(
          section[section.length - 1].range?.start,
          section[0].range?.end
        )}</span
      >
    </p>
  </div>

  {#each section as item, i}
    {#if item}
      <TimelineItem
        title={item.subtitle}
        body={item.body}
        range={item.range}
        last={i === section.length - 1}
      ></TimelineItem>
    {/if}
  {/each}
</section>
