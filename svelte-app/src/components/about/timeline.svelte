<script lang="ts">
  import TimelineSection from '$components/about/timeline-section.svelte';

  import type { AuthorTimelineItem } from '$types';

  export let data: AuthorTimelineItem[];

  let sections: Record<string, AuthorTimelineItem[]> = {};

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
