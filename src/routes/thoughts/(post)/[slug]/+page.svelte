<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import ArrowLeftSmall from '$components/icons/arrow-left-small.svelte';
  import ArrowRightSmall from '$components/icons/arrow-right-small.svelte';
  import type { Post } from '$lib/content';
  import { PAGE_OUT_DURATION, prefersReducedMotion } from '$lib/transitions';

  const { data } = $props();
  const PostComponent = $derived(data.post.Component);

  /**
   * Post-to-post links carry data-sveltekit-noscroll, so the default instant
   * scroll reset (which yanks the viewport while the old page is still fully
   * visible) is suppressed. Instead, jump to the top once the outgoing page
   * has faded — the reposition lands while the screen is effectively blank.
   * Back/forward stays untouched: SvelteKit restores scroll on popstate.
   */
  afterNavigate((nav) => {
    if (
      nav.type !== 'link' ||
      nav.from?.route.id !== nav.to?.route.id ||
      nav.to?.url.hash
    ) {
      return;
    }
    if (prefersReducedMotion()) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), PAGE_OUT_DURATION);
  });

  $effect(() => {
    if (page?.url) {
      const { hash } = page.url || { hash: '' };

      if (!hash.length) {
        return;
      }

      const target =
        document.getElementById(hash.slice(1)) ||
        document.getElementById(`heading-${hash.slice(1)}`);

      target?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
        block: 'center',
      });
    }
  });
</script>

<svelte:head>
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta
    property="article:published_time"
    content={new Date(data.post.date || '0')?.toISOString()}
  />
</svelte:head>

<PostComponent />

{#snippet adjacentLink(post: Post, newer: boolean)}
  <a
    class="group flex flex-col gap-1.5 py-2 {newer
      ? 'col-start-2 items-end text-right'
      : 'col-start-1 items-start'}"
    href={`/thoughts/${post.slug}`}
    data-sveltekit-noscroll
  >
    <span
      class="flex items-center gap-1.5 font-mono text-xs tracking-wide uppercase opacity-50"
    >
      {#if newer}
        Newer <ArrowRightSmall class="size-3" />
      {:else}
        <ArrowLeftSmall class="size-3" /> Older
      {/if}
    </span>
    <span
      class="group-hover:decoration-orange-light group-hover:dark:decoration-orange-dark text-md font-semibold text-balance underline decoration-transparent decoration-2 underline-offset-[3px] opacity-90 transition-[text-decoration-color,opacity] group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-60"
    >
      {post.title}
    </span>
  </a>
{/snippet}

{#if data.adjacent.older || data.adjacent.newer}
  <nav
    aria-label="Adjacent posts"
    class="mt-4 grid grid-cols-2 gap-6 border-t border-neutral-200 pt-5 dark:border-neutral-400"
  >
    {#if data.adjacent.older}
      {@render adjacentLink(data.adjacent.older, false)}
    {/if}
    {#if data.adjacent.newer}
      {@render adjacentLink(data.adjacent.newer, true)}
    {/if}
  </nav>
{/if}
