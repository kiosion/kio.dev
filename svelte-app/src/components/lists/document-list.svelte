<script lang="ts">
  import ListItem from '$components/lists/list-item.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let documents: (ProjectDocument | PostDocument)[];
</script>

<div>
  {#each documents as document}
    <ListItem {document} />
  {/each}
</div>

<style lang="scss">
  div {
    @apply flex w-full flex-col gap-7 pt-5;
  }
</style>
