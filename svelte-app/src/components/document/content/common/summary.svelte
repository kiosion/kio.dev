<script lang="ts">
  import type { DocumentHeadings } from '$types';

  export let headings: DocumentHeadings[];
</script>

<div class={$$props.class}>
  {#each headings as heading}
    <a
      href={`#${heading.key}`}
      class="focusOutline-sm block w-full select-none overflow-hidden text-ellipsis whitespace-nowrap rounded-sm py-2 text-base font-medium hover:text-accent-light dark:hover:text-accent-dark"
    >
      &bull;&nbsp;&nbsp;{heading.text}
    </a>
    {#if heading.children?.length}
      <svelte:self headings={heading.children} class="ml-5" />
    {/if}
  {/each}
</div>
