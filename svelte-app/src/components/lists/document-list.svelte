<script lang="ts">
  import ListItem from '$components/lists/list-item.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let documents: (ProjectDocument | PostDocument)[];
</script>

<div
  class="mb-5 flex w-full flex-col gap-8 px-6 md:mb-6 md:px-8"
  role="group"
  {...$$restProps}
>
  {#each documents as document, idx}
    <ListItem {document}></ListItem>
    {#if idx < documents.length - 1}
      <span
        class="-my-4 block w-full min-w-0 border-b border-dashed border-neutral-200 transition-colors dark:border-neutral-400"
      ></span>
    {/if}
  {/each}
</div>
