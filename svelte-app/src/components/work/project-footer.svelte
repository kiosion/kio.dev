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
        <a
          href="/work/{tag.slug.current}"
          class="font-code capitalize text-base px-2 py-1 bg-slate-200 dark:bg-slate-900 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          {tag.title}
        </a>
      {/each}
    </div>
  {/if}
</div>
