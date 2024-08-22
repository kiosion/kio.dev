<script lang="ts">
  import { page } from '$app/stores';

  import type { PostDocument, ProjectDocument } from '$types';

  export let headings: (PostDocument | ProjectDocument)['headings'];

  $: ({ hash } = $page?.url || { hash: '' });
</script>

{#each headings as heading}
  <div class="w-full pt-0.5 text-base">
    <a
      href={`#${heading.key}`}
      class="focus-outline-sm group flex w-full flex-row items-center gap-x-2 rounded-xs text-neutral-700 decoration-orange-light transition-colors hover:text-orange-light dark:text-neutral-100 dark:hover:text-orange-light"
      class:underline={heading.key === hash.slice(1)}
    >
      <span
        class="inline-block h-1 w-1 rounded-full bg-neutral-600 transition-colors group-hover:bg-orange-light dark:bg-neutral-200"
      ></span>
      <span class="line-clamp-1">{heading.text}</span>
    </a>
    {#if heading.children?.length}
      <div class="pl-4">
        <svelte:self headings={heading.children} />
      </div>
    {/if}
  </div>
{/each}
