<script lang="ts">
  import { currentLang, t } from '$i18n';

  import TimelineSection from './timeline-section.svelte';

  import type { AuthorTimelineItem } from '$types';

  export let data: AuthorTimelineItem[];

  let sections: Record<string, AuthorTimelineItem[]> = {};

  const dateDisplay = (start: string, end: string | undefined) => {
    try {
      const startDate = new Date(start),
        endDate = end ? new Date(end) : undefined;

      if (!endDate) {
        return `${new Intl.DateTimeFormat($currentLang, {
          month: 'short',
          year: 'numeric'
        }).format(startDate)} - ${$t('present')}`;
      }

      return `${new Intl.DateTimeFormat($currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(startDate)} - ${new Intl.DateTimeFormat($currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(endDate)}`;
    } catch (_) {
      return $t('Invalid date');
    }
  };

  $: {
    sections = {};
    for (const item of data) {
      if (sections[item.title]) {
        sections[item.title].push(item);
      } else {
        sections[item.title] = [item];
      }
    }
  }
</script>

{#each Object.keys(sections) as section}
  <TimelineSection section={sections[section]} />
{/each}
