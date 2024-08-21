<script lang="ts">
  import ListItem from '$components/lists/list-item.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let documents: (ProjectDocument | PostDocument)[];
</script>

<div class="flex w-full flex-row flex-wrap gap-5" role="group" {...$$restProps}>
  {#each documents as document}
    <ListItem {document} />
  {/each}
</div>
