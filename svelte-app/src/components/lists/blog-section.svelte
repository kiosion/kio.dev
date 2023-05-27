<script lang="ts">
  import ListItem from '$components/lists/blog-item.svelte';

  import type { PostDocument } from '$types';

  export let posts: PostDocument[];
</script>

{#if posts.length === 1}
  <ListItem post={posts[0]} position="solo" />
{:else}
  <ListItem post={posts[0]} position="first" />
  {#each posts.slice(1, posts.length - 1) as post}
    <ListItem {post} position="middle" />
  {/each}
  <ListItem post={posts[posts.length - 1]} position="last" />
{/if}
