<script lang="ts">
  import type { PostDocument } from '$types';
  import ListItem from '$components/lists/blog-item.svelte';

  export let posts: PostDocument[];
</script>

{#each posts as post, index}
  {#if index === 0}
    <ListItem {post} position="first" />
  {:else if index === posts.length - 1}
    <ListItem {post} position="last" />
  {:else}
    <ListItem {post} position="middle" />
  {/if}
{/each}
