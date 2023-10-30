<script lang="ts">
  import { firstVisibleHeading } from '$lib/summary';

  import type { DocumentHeadings } from '$types';

  export let headings: DocumentHeadings[];
</script>

<div class={$$props.class}>
  {#each headings as heading}
    <a
      href={`#${heading.key}`}
      class="focusOutline-sm"
      class:active={heading.key === $firstVisibleHeading}
    >
      <span class="bar" />
      <span class="indicator" />
      <span class="sr-only">Jump to </span>
      {heading.text}
    </a>
    {#if heading.children?.length}
      <svelte:self headings={heading.children} class="ml-5" />
    {/if}
  {/each}
</div>

<style lang="scss">
  a {
    @apply relative block w-full select-none overflow-hidden text-ellipsis whitespace-nowrap rounded-sm py-2 pl-3 text-base font-medium text-dark;

    &:hover,
    &:focus-visible {
      @apply text-accent-light;
    }
  }

  .bar {
    @apply absolute bottom-1.5 left-0 top-1.5 w-[2px] bg-accent-light/80;
  }

  .indicator {
    @apply absolute bottom-1.5 left-0 top-1.5 w-full bg-accent-light/20 opacity-0 transition-opacity;

    .active & {
      @apply opacity-100;
    }
  }

  :global(.dark) {
    a {
      @apply text-light;

      &:hover,
      &:focus-visible {
        @apply text-accent-dark;
      }
    }

    .bar {
      @apply bg-accent-dark/80;
    }

    .indicator {
      @apply bg-accent-dark/20;
    }
  }
</style>
