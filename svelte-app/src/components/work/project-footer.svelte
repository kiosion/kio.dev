<script lang="ts">
  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type { ProjectDocument } from '$lib/types';

  export let project: ProjectDocument;
</script>

<div class="mt-4" data-test-id="post-footer">
  <Divider />
  {#if project.tags}
    <IconHeader icon="CardText" text="Tags" classes="mt-8 mb-4 w-full h-fit" />
    <div class="mb-6 flex flex-row flex-wrap gap-2 justify-start items-start">
      {#each project.tags as tag}
        <a href="/work/t/{tag.slug.current}" class="categoryTag">
          {tag.title}
        </a>
      {/each}
    </div>
  {/if}
</div>
