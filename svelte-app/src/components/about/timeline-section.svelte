<script lang="ts">
  import { displayMonthDuration, displayRange } from '$lib/date';
  import { t } from '$lib/i18n';

  import TimelineItem from '$components/about/timeline-item.svelte';

  import type { WorkTimelineItem } from '$types';

  export let section: WorkTimelineItem[];

  const title = section[0].title,
    id = Math.random().toString(36).substring(7);
</script>

<section class="my-6" role="group" aria-labelledby="{id}-heading">
  <div class="pb-3">
    <h2
      class="pb-1 text-xl font-bold text-dark transition-colors dark:text-white"
      id="{id}-heading"
    >
      {title}
    </h2>
    <p
      class="font-mono text-sm text-dark/80 transition-colors dark:text-light/80"
      aria-label={$t('Duration')}
    >
      {$displayRange(section[section.length - 1].range.start, section[0].range.end)} &bull;
      {$displayMonthDuration(
        section[section.length - 1].range.start,
        section[0].range.end
      )}
    </p>
  </div>

  {#each section as item, i}
    <TimelineItem
      title={item.subtitle}
      body={item.body}
      range={item.range}
      last={i === section.length - 1}
    ></TimelineItem>
  {/each}
</section>
