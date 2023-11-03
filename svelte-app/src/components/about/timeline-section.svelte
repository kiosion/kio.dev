<script lang="ts">
  import { derived } from 'svelte/store';

  import { currentLang, t } from '$i18n';

  import TimelineItem from './timeline-item.svelte';

  import type { AuthorTimelineItem } from '$types';

  export let section: AuthorTimelineItem[];

  const title = section[0].title;

  const dateDisplay = derived([currentLang, t], ([currentLang, t]) => {
    return (start: string, end: string | undefined) => {
      try {
        const startDate = new Date(start),
          endDate = end ? new Date(end) : undefined;

        if (!endDate) {
          return `${new Intl.DateTimeFormat(currentLang, {
            month: 'short',
            year: 'numeric'
          }).format(startDate)} - ${t('present')}`;
        }

        return `${new Intl.DateTimeFormat(currentLang, {
          month: 'short',
          year: 'numeric'
        }).format(startDate)} - ${new Intl.DateTimeFormat(currentLang, {
          month: 'short',
          year: 'numeric'
        }).format(endDate)}`;
      } catch (_) {
        return t('Invalid date');
      }
    };
  });
</script>

<section>
  <h1>{title}</h1>

  <div>
    {#each section as item}
      <TimelineItem
        title={item.subtitle}
        body={item.body}
        date={$dateDisplay(item.range.start, item.range.end)}
      />
    {/each}
  </div>
</section>

<style lang="scss">
  h1 {
    @apply mb-3 font-code text-2xl font-bold text-dark transition-colors;
  }

  section {
    @apply my-6;

    div {
      @apply flex flex-col;
    }
  }

  :global(.dark) {
    h1 {
      @apply text-white;
    }
  }
</style>
