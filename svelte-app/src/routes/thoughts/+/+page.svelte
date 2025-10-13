<script lang="ts">
  const { data } = $props();
</script>

{#snippet tagItem(tag: (typeof data.tags)[number])}
  <a
    class="group flex flex-row items-center justify-start gap-x-0.5"
    href={`/thoughts/+/${tag.slug?.current}`}
    data-sveltekit-preload-code
    data-sveltekit-preload-data
    aria-label={'Topic' + ': ' + tag.title}
  >
    <span class="opacity-70 select-none">#</span>
    <span
      class="decoration-orange-light dark:decoration-orange-dark decoration-2 underline-offset-[3px] opacity-70 transition-opacity group-hover:underline group-hover:opacity-100"
      >{tag.title?.toLowerCase()}</span
    >
  </a>
{/snippet}

<div class="flex h-full min-w-full flex-grow flex-col gap-y-10">
  <section
    class="mt-10 flex w-full flex-row flex-wrap items-start justify-between gap-y-12"
  >
    <div class="mr-auto flex flex-col gap-8">
      <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">Topics</h1>
    </div>
  </section>
  <div class="flex min-h-0 max-w-prose flex-1 flex-col gap-y-2 text-lg">
    {#if !data.tags.length}
      <p>No topics found.</p>
    {:else}
      {#each data.tags as tag}
        {@render tagItem(tag)}
      {/each}
    {/if}
  </div>
</div>
