<script lang="ts">
  import { slide } from 'svelte/transition';
  import Divider from '$components/divider.svelte';
  import Item from '$components/document/content/common/summary/item.svelte';
  import type { Heading as PTHeading } from '$helpers/pt';

  export let headings: PTHeading[],
    headingsExist = false;
</script>

<div
  class="mx-7 h-fit overflow-hidden px-1 pb-3"
  in:slide={{ duration: 400 }}
  out:slide={{ duration: 400 }}
>
  <Divider classes="mb-3 mt-0" />

  {#if headingsExist}
    <Item {headings} />
  {/if}
</div>
