<script lang="ts">
  import { page } from '$app/state';
  import EmptyContent from '$components/empty-content.svelte';
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';
  import PostList from '$components/post-list.svelte';
  import type { Post } from '$lib/content';

  let { data } = $props();

  const ThoughtsContent = $derived(data.content.Component);

  const tagSlug = (tag: string) =>
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const selected = $derived(page.params.slug);

  const isActiveTag = (slug?: string) => !!selected && slug === selected;

  const posts = $derived(
    selected
      ? data.posts.filter((p) => (p.tags ?? []).some((t) => tagSlug(t) === selected))
      : data.posts,
  );

  // Group the (already tag-filtered) posts into year buckets, newest year first.
  const postsByYear = $derived.by(() => {
    const groups = new Map<number, Post[]>();
    for (const p of posts) {
      const year = new Date(p.date).getFullYear();
      const bucket = groups.get(year);
      if (bucket) {
        bucket.push(p);
      } else {
        groups.set(year, [p]);
      }
    }
    return [...groups.entries()]
      .sort(([a], [b]) => b - a)
      .map(([year, posts]) => ({ year, posts }));
  });
</script>

<svelte:head>
  <meta name="robots" content="index, follow" />
</svelte:head>

{#snippet tagItem(tag: { slug: string; title: string })}
  <a
    class="group flex flex-row items-center justify-start gap-x-0.5"
    href={isActiveTag(tag.slug) ? '/thoughts' : `/thoughts/+/${tag.slug}`}
    aria-current={isActiveTag(tag.slug) ? 'page' : undefined}
    data-sveltekit-preload-code="eager"
    data-sveltekit-preload-data="hover"
    data-sveltekit-replacestate
    data-sveltekit-noscroll
  >
    <span class="opacity-70 select-none">#</span>
    <span
      class="underline decoration-2 underline-offset-[3px] transition-[opacity,text-decoration-color,color]"
      class:opacity-100={isActiveTag(tag.slug)}
      class:decoration-orange-light={isActiveTag(tag.slug)}
      class:dark:decoration-orange-dark={isActiveTag(tag.slug)}
      class:opacity-70={!isActiveTag(tag.slug)}
      class:decoration-transparent={!isActiveTag(tag.slug)}
      class:group-hover:opacity-100={!isActiveTag(tag.slug)}
      class:group-hover:decoration-orange-light={!isActiveTag(tag.slug)}
      class:group-hover:dark:decoration-orange-dark={!isActiveTag(tag.slug)}
    >
      {tag.title?.toLowerCase()}</span
    >
  </a>
{/snippet}

<PageSection>
  <PageTitle>{data.content.title}</PageTitle>

  <div class="prose-links flex max-w-prose flex-col gap-3 text-lg">
    <ThoughtsContent />
    <p
      class="inline font-mono text-base opacity-50"
      aria-label="{posts.length} posts total"
    >
      [ {String(posts.length).padStart(2, '0')} ]
    </p>
  </div>

  {#if data.tags.length}
    <div
      class="text-md flex max-w-prose flex-row flex-wrap items-center justify-start gap-3 pl-1"
    >
      {#each data.tags as tag (tag.slug)}
        {@render tagItem(tag)}
      {/each}
    </div>
  {/if}
</PageSection>

<PageSection>
  {#if posts.length}
    <div class="flex flex-col gap-8">
      {#each postsByYear as { year, posts: yearPosts } (year)}
        <section>
          <div class="flex w-full flex-row items-center justify-start gap-3">
            <h2
              class="shrink-0 font-mono text-sm tracking-wider text-neutral-500 opacity-70 dark:text-neutral-200"
            >
              {year}
            </h2>
            <span class="h-px flex-1 bg-neutral-200 dark:bg-neutral-400"></span>
          </div>
          <PostList posts={yearPosts} />
        </section>
      {/each}
    </div>
  {:else}
    <EmptyContent message="No posts found." />
  {/if}
</PageSection>
