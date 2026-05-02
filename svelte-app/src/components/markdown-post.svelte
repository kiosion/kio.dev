<script lang="ts">
  let {
    title,
    date,
    desc,
    children,
  }: {
    title?: string;
    date?: string;
    desc?: string;
    children?: import('svelte').Snippet;
  } = $props();

  const formattedDate = $derived.by(() => {
    if (!date) {
      return undefined;
    }
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      return date;
    }
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });
</script>

<div class="flex w-full flex-col gap-y-5">
  {#if title}
    <section
      class="mt-8 flex w-full flex-col gap-y-6 border-b border-neutral-200 pb-6 dark:border-neutral-400">
      <div class="flex flex-col gap-y-4">
        <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
          {title}
        </h1>
        {#if formattedDate}
          <div
            class="flex flex-row items-center gap-2 text-base text-neutral-500 dark:text-neutral-100">
            <p class="cursor-default" aria-label="Published date">{formattedDate}</p>
          </div>
        {/if}
      </div>
      {#if desc}
        <p
          class="text-md max-w-prose tracking-wide text-neutral-500 dark:text-neutral-100">
          {desc}
        </p>
      {/if}
    </section>
  {/if}

  <section class="md-body font-sans text-base">
    {@render children?.()}
  </section>
</div>

<style lang="scss">
  @reference '../tailwind.css';

  .md-body {
    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6) {
      @apply font-display font-semibold tracking-wide;
    }
    :global(h1) {
      @apply mt-10 mb-6 text-3xl leading-[1.1];
    }
    :global(h2) {
      @apply mt-10 mb-6 text-2xl leading-[1.05];
    }
    :global(h3) {
      @apply mt-8 mb-5 text-xl leading-tight;
    }
    :global(h4),
    :global(h5),
    :global(h6) {
      @apply mt-6 mb-4 text-lg leading-tight;
    }

    :global(p) {
      @apply mt-4 max-w-prose leading-relaxed;
    }

    :global(a) {
      @apply hover:decoration-orange-light dark:hover:decoration-orange-dark underline decoration-neutral-200 decoration-2 underline-offset-[3px] opacity-90 transition-opacity hover:opacity-100 dark:decoration-neutral-400;
    }

    :global(ul),
    :global(ol) {
      @apply mt-4 ml-6 max-w-prose;
    }
    :global(ul) {
      @apply list-disc;
    }
    :global(ol) {
      @apply list-decimal;
    }
    :global(li) {
      @apply mt-2 leading-relaxed;
    }

    :global(blockquote) {
      @apply border-orange-light dark:border-orange-dark my-6 max-w-prose border-l-2 pl-4 italic opacity-90;
    }

    :global(p > code),
    :global(li > code) {
      @apply mx-0.5 rounded-sm bg-neutral-200/60 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-400/60;
    }

    :global(hr) {
      @apply my-8 border-t border-dashed border-neutral-300;
    }

    :global(img) {
      @apply my-6 max-w-full rounded-md;
    }
  }
</style>
