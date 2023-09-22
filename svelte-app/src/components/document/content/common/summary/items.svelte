<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import SummaryItem from '$components/document/content/common/summary/item.svelte';

  import type { DocumentHeadings } from '$types';

  export let headings: DocumentHeadings[];
</script>

<div
  class="relative my-6 border-t border-dark/50 px-4 pt-4 dark:border-light/50"
  transition:slide={{
    duration: 250 + headings.length * 10,
    easing: cubicInOut
  }}
>
  <SummaryItem {headings} />
</div>
