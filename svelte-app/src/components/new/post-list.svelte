<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';

  import { browser } from '$app/environment';
  import EmptyContent from '$components/empty-content.svelte';
  import type { GetPostsQueryResult } from '$types/sanity';
  import { flip } from 'svelte/animate';
  import { fade, slide } from 'svelte/transition';

  const { posts }: { posts: NonNullable<GetPostsQueryResult> } = $props();

  let hydrated = $state(false);

  let rendered = $state(posts);
  let staged: typeof posts | null = $state(null);
  let pendingOutros = $state(0);

  const fmt = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  const fadeSlide = (node: Element, opts: { duration: number; idx: number }) => {
    const duration = opts.duration;
    const delay = (rendered.length - 1 - opts.idx) * 15;

    const f = fade(node, { duration, delay });
    const s = slide(node, { duration, delay });

    return {
      duration: duration + delay,
      css: (t: number, u: number) => {
        const sCss = s?.css ? s.css(t, u) : '';
        const fCss = f?.css ? f.css(t, u) : '';
        return `${sCss};${fCss}`;
      },
    };
  };

  $effect(() => {
    const next = posts;
    const isHydrated = hydrated;

    untrack(() => {
      if (!isHydrated) {
        rendered = posts;
        staged = null;
        pendingOutros = 0;
        return;
      }

      const nextIds = new Set(next.map((p) => p._id));

      const curRendered = rendered;
      const curPending = pendingOutros;

      if (curPending > 0) {
        staged = next;

        const intersection = curRendered.filter((p) => nextIds.has(p._id));
        const extraRemovals = curRendered.length - intersection.length;

        if (extraRemovals > 0) {
          pendingOutros = curPending + extraRemovals;
          rendered = intersection;
        }

        return;
      }

      const intersection = curRendered.filter((p) => nextIds.has(p._id));
      const removals = curRendered.length - intersection.length;

      if (removals > 0) {
        staged = next;
        pendingOutros = removals;
        rendered = intersection;
      } else {
        rendered = next;
      }
    });
  });

  async function handleOutroEnd() {
    if (pendingOutros <= 0) {
      return;
    }
    pendingOutros -= 1;

    if (pendingOutros === 0 && staged) {
      // wait a tick so Svelte settles the outro DOM before committing the new list
      await tick();
      rendered = staged;
      staged = null;
    }
  }

  onMount(() => {
    if (!browser) {
      return;
    }
    hydrated = true;
  });

  const showEmpty = $derived(rendered.length === 0 && pendingOutros === 0 && !staged);
</script>

<div class="mb-4 border-y border-neutral-300 dark:border-neutral-400">
  {#if showEmpty}
    <EmptyContent message="No posts found." />
  {:else}
    <ul class="divide-y divide-neutral-300 dark:divide-neutral-400">
      {#each rendered as post, idx (post._id)}
        <li
          animate:flip={{ duration: 220 }}
          in:fade={{ duration: 140, delay: idx * 15 }}
          out:fadeSlide={{ duration: 200, idx }}
          onoutroend={handleOutroEnd}>
          <a class="group block py-4" href={`/thoughts/${post.slug.current}`}>
            <div class="flex items-baseline justify-between gap-4">
              <h3
                class="group-hover:decoration-orange-light group-hover:dark:decoration-orange-dark font-semibold underline decoration-transparent decoration-2 underline-offset-[3px] opacity-100 transition-[text-decoration-color,color,opacity] group-hover:opacity-80 group-focus-visible:opacity-80">
                {post.title}
              </h3>
              <time class="text-sm whitespace-nowrap opacity-70">
                {fmt.format(new Date(post.date!))}
              </time>
            </div>

            {#if post.desc}
              <p class="mt-1 text-base opacity-70">{post.desc}</p>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>
