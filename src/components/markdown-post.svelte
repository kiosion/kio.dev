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

  let bodyEl: HTMLElement | undefined = $state();

  /**
   * Intercept clicks on in-page hash links inside the post body so the target
   * scrolls to viewport center (smooth) instead of snapping to the top.
   */
  $effect(() => {
    const el = bodyEl;
    if (!el) {
      return;
    }
    const handler = (e: MouseEvent) => {
      const link = (e.target instanceof Element ? e.target : null)?.closest(
        'a[href^="#"]',
      );
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        return;
      }
      const target = document.getElementById(href.slice(1));
      if (!target) {
        return;
      }
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      history.pushState(null, '', href);
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  });
</script>

<div class="flex w-full flex-col gap-y-5">
  {#if title}
    <section
      class="mt-8 flex w-full flex-col gap-y-6 border-b border-neutral-200 pb-6 dark:border-neutral-400"
    >
      <div class="flex flex-col gap-y-4">
        <h1
          class="font-display flex max-w-2xl flex-col text-4xl font-semibold tracking-wide md:text-5xl"
        >
          {title}
        </h1>
        {#if formattedDate}
          <div
            class="flex flex-row items-center gap-2 text-base text-neutral-500 dark:text-neutral-100"
          >
            <p class="cursor-default" aria-label="Published date">{formattedDate}</p>
          </div>
        {/if}
      </div>
      {#if desc}
        <p
          class="text-md max-w-prose tracking-wide text-neutral-500 dark:text-neutral-100"
        >
          {desc}
        </p>
      {/if}
    </section>
  {/if}

  <section bind:this={bodyEl} class="md-body text-md font-sans">
    {@render children?.()}
  </section>
</div>

<style>
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
      @apply hover:decoration-orange-light dark:hover:decoration-orange-dark underline decoration-neutral-200 decoration-2 underline-offset-[3px] opacity-90 transition-[opacity,text-decoration-color] hover:opacity-100 dark:decoration-neutral-400;
    }

    :global(.heading-anchor) {
      @apply no-underline opacity-100;
    }
    :global(.heading-anchor:hover),
    :global(.heading-anchor:focus-visible) {
      @apply decoration-orange-light dark:decoration-orange-dark underline;
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

    :global(pre.shiki) {
      @apply my-6 max-w-3xl overflow-x-auto rounded-md p-4 font-mono text-sm leading-5;
    }

    :global(pre.shiki code) {
      @apply font-mono;
    }

    :global(hr) {
      @apply my-8 border-t border-dashed border-neutral-300;
    }

    :global(img) {
      @apply my-6 h-auto max-w-3xl rounded-md;
    }

    :global(.footnote-ref) {
      @apply text-xs font-semibold;
    }
    :global(.footnote-ref a) {
      @apply text-orange-light dark:text-orange-dark no-underline opacity-100 hover:opacity-80;
    }

    :global(.footnotes-heading) {
      @apply mt-12 text-lg font-semibold tracking-wide text-neutral-500 dark:text-neutral-100;
    }
    :global(.footnotes) {
      @apply mt-2 ml-5 max-w-prose text-sm text-neutral-500 dark:text-neutral-100;
    }
    :global(.footnotes li) {
      @apply mt-1 leading-relaxed;
    }
    :global(.footnote-backref) {
      @apply text-orange-light dark:text-orange-dark ml-1 inline-block no-underline opacity-100 hover:opacity-80;
    }
  }
</style>
