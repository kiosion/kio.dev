<script lang="ts">
  import { page } from '$app/state';
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';
  import { prefersReducedMotion, receive, send } from '$lib/transitions';

  let {
    title,
    date,
    desc,
    tags,
    children,
  }: {
    title?: string;
    date?: string;
    desc?: string;
    tags?: string[];
    children?: import('svelte').Snippet;
  } = $props();

  // Receives the post-list card's title/desc on navigation so the card morphs
  // into the post hero. Receive-only here (the card is the sole sender), so two
  // cards can never pair with each other across pages.
  const slug = $derived(page.params.slug ?? '');

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
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
        block: 'center',
      });
      history.pushState(null, '', href);
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  });
</script>

<article class="flex w-full flex-col gap-y-5">
  {#if title}
    <PageSection as="header">
      <div
        class="w-fit max-w-full"
        out:send|global={{ key: `post-title-out-${slug}` }}
        in:receive|global={{ key: `post-title-in-${slug}` }}
      >
        <PageTitle>
          {title}
        </PageTitle>
      </div>
      <div
        class="flex flex-col gap-y-4 text-neutral-500 dark:text-neutral-100"
        out:send|global={{ key: `post-meta-out-${slug}` }}
        in:receive|global={{ key: `post-meta-in-${slug}` }}
      >
        {#if formattedDate || tags?.length}
          <div class="flex flex-row flex-wrap items-center gap-y-2">
            {#if formattedDate}
              <time class="text-base" datetime={date}>
                <span class="sr-only">Published </span>{formattedDate}
              </time>
            {/if}
            {#if tags?.length}
              {#if formattedDate}<span
                  aria-hidden="true"
                  class="mx-3 opacity-70 select-none">&ndash;</span
                >{/if}
              <ul role="list" class="flex flex-row flex-wrap gap-x-2 gap-y-2">
                {#each tags as tag}
                  <li>
                    <a
                      class="group flex flex-row items-center justify-start gap-x-0.5"
                      href={`/thoughts/+/${tag}`}
                      rel="tag"
                      aria-label={`Posts tagged ${tag}`}
                      data-sveltekit-preload-code="hover"
                      data-sveltekit-preload-data="hover"
                    >
                      <span aria-hidden="true" class="opacity-70 select-none">#</span>
                      <span
                        class="group-hover:decoration-orange-light group-hover:dark:decoration-orange-dark underline decoration-transparent decoration-2 underline-offset-[3px] opacity-80 transition-[opacity,text-decoration-color,color] group-hover:opacity-100"
                      >
                        {tag}</span
                      >
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/if}
        {#if desc}
          <p class="text-md max-w-prose tracking-wide" role="doc-subtitle">
            {desc}
          </p>
        {/if}
      </div>
    </PageSection>
  {/if}

  <section
    bind:this={bodyEl}
    class="md-body text-md border-t border-neutral-200 pt-6 font-sans dark:border-neutral-400"
    in:receive|global={{ key: `post-body-in-${slug}` }}
    out:send|global={{ key: `post-body-out-${slug}` }}
  >
    {@render children?.()}
  </section>
</article>

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
      @apply relative underline decoration-transparent opacity-100 transition-[text-decoration-color];

      &:hover,
      &:focus-visible {
        &:before {
          @apply opacity-75;
        }
      }

      &:before {
        @apply text-md absolute top-1/2 -left-5 -translate-y-1/2 opacity-0 transition-opacity;
        content: '#';
      }
    }
    :global(.heading-anchor:hover),
    :global(.heading-anchor:focus-visible) {
      @apply decoration-orange-light dark:decoration-orange-dark;
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
      @apply my-6 max-w-prose pl-3 italic opacity-90;

      &::before {
        @apply font-display text-orange-light dark:text-orange-dark float-left mt-6 mr-4 -ml-2.5 text-6xl leading-0 font-semibold;
        content: '“';
      }
    }
    :global(blockquote p:first-child) {
      @apply mt-0;
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
      @apply my-8 border-t border-dashed border-neutral-200 dark:border-neutral-400;
    }

    :global(img) {
      @apply my-6 h-auto max-w-3xl rounded-md;
    }

    :global(.footnote-ref) {
      @apply text-xs font-semibold;
    }
    :global(.footnote-ref a) {
      @apply text-orange-light dark:text-orange-dark -my-1.5 -mr-1 -ml-2 p-1.5 no-underline opacity-100 hover:opacity-80;
    }

    :global(.footnotes-heading) {
      @apply mt-12 text-xl font-semibold tracking-wide text-neutral-500 dark:text-neutral-100;
    }
    :global(.footnotes) {
      @apply mt-2 ml-5 max-w-prose text-base text-neutral-500 dark:text-neutral-100;
    }
    :global(.footnotes li) {
      @apply mt-1 leading-relaxed;
    }
    :global(.footnote-backref) {
      @apply text-orange-light dark:text-orange-dark ml-1 inline-block no-underline opacity-100 hover:opacity-80;
    }
  }
</style>
