<script lang="ts">
  import ListItem from '$components/lists/list-item.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let documents: (ProjectDocument | PostDocument)[];
</script>

<div class="flex w-full flex-col gap-8 pt-5" role="group" {...$$restProps}>
  {#each documents as document}
    <ListItem {document} />
  {/each}
</div>
