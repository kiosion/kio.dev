<script lang="ts">
  import type { PostDocument, ProjectDocument } from '$types';
  export let headings: (PostDocument | ProjectDocument)['headings'];
</script>

{#each headings as heading}
  <div class="w-full px-1 pt-0.5 text-base">
    <a
      href={`#${heading.key}`}
      class="focus-outline-sm flex w-full flex-row gap-x-2 rounded-xs text-neutral-600 transition-colors hover:text-orange-light dark:text-neutral-200 dark:hover:text-orange-light"
    >
      <span class="font-bold">&bull;</span><span class="line-clamp-1">{heading.text}</span
      >
    </a>
    {#if heading.children?.length}
      <div class="pl-3">
        <svelte:self headings={heading.children} />
      </div>
    {/if}
  </div>
{/each}
