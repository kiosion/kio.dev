<script lang="ts">
  import Divider from '$components/context-menu/divider.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import type { PostDocument, ProjectDocument } from '$lib/types';

  export let model: 'post' | 'project';
  export let data: PostDocument | ProjectDocument;
</script>

<div class="mt-4" data-test-id="{model}-footer">
  <Divider />
  {#if data.tags}
    <IconHeader icon="CardText" text="Tags" classes="mt-8 mb-4 w-full h-fit" />
    <div class="mb-6 flex flex-row flex-wrap gap-2 justify-start items-start">
      {#each data.tags as tag}
        <Hoverable>
          <a
            href="/{model === 'post' ? 'blog' : 'work'}/+/{tag.slug.current}"
            class="categoryTag"
          >
            {tag.title}
          </a>
        </Hoverable>
      {/each}
    </div>
  {/if}
</div>
