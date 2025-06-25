<script lang="ts">
  import ListItem from '$components/lists/list-item.svelte';
  import type { GetPostsQueryResult } from '$types/sanity';

  export let documents: NonNullable<GetPostsQueryResult>;
</script>

<div class="flex w-full flex-row flex-wrap gap-6 py-1" role="group" {...$$restProps}>
  {#each documents as document}
    <ListItem {document} />
  {/each}
</div>
