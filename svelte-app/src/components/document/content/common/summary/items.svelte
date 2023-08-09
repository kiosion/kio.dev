<script lang="ts">
  import { circInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import Divider from '$components/divider.svelte';
  import Item from '$components/document/content/common/summary/item.svelte';

  import type { DocumentHeadings } from '$types';

  export let headings: DocumentHeadings[],
    headingsExist = false;
</script>

<div
  class="mx-7 h-fit overflow-hidden px-1 pb-3"
  transition:slide={{ duration: 300, easing: circInOut }}
>
  <Divider classes="mb-3 mt-0" />

  {#if headingsExist}
    <Item {headings} />
  {/if}
</div>
