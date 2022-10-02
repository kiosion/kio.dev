<script lang="ts">
  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type { PostDocument } from '$lib/types';
  import Hoverable from '$components/hoverable.svelte';

  export let post: PostDocument;
</script>

<div class="mt-4" data-test-id="post-footer">
  <Divider />
  {#if post.tags}
    <IconHeader icon="CardText" text="Tags" classes="mt-8 mb-4 w-full h-fit" />
    <div class="mb-6 flex flex-row flex-wrap gap-2 justify-start items-start">
      {#each post.tags as tag}
        <Hoverable>
          <a href="/blog/+/{tag.slug.current}" class="categoryTag">
            {tag.title}
          </a>
        </Hoverable>
      {/each}
    </div>
  {/if}
  <!-- TODO: Lazy-load 4 or so recent articles or articles with similar tags (algolia) -->
  {#if false}
    <IconHeader
      icon="ArticleMultiple"
      text="More posts"
      classes="mt-8 mb-4 w-full h-fit"
    />
  {/if}
</div>
