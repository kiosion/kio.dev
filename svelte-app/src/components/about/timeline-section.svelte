<script lang="ts">
  import { displayMonthDuration, displayRange } from '$lib/date';
  import { t } from '$lib/i18n';

  import TimelineItem from '$components/about/timeline-item.svelte';

  import type { WorkTimelineItem } from '$types';

  export let section: WorkTimelineItem[];

  const title = section[0].title,
    id = Math.random().toString(36).substring(7);
</script>

<section role="group" aria-labelledby="{id}-heading">
  <div>
    <h2 id="{id}-heading">{title}</h2>
    <p aria-label={$t('Duration')}>
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
    />
  {/each}
</section>

<style lang="scss">
  h2 {
    @apply pb-1 text-lg font-bold text-dark transition-colors;
  }

  p {
    @apply font-mono text-sm text-dark/80 transition-colors;
  }

  div {
    @apply pb-4;
  }

  section {
    @apply my-6;
  }

  :global(.dark) {
    h2 {
      @apply text-white;
    }

    p {
      @apply text-light/80;
    }
  }
</style>
