<script lang="ts">
  import { page } from '$app/state';
  import EmptyContent from '$components/empty-content.svelte';
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';
  import PostList from '$components/post-list.svelte';
  import type { Post } from '$lib/content';
  import { listEnter, listExit } from '$lib/transitions';

  let { data } = $props();

  const ThoughtsContent = $derived(data.content.Component);

  const selected = $derived(page.params.slug);

  const isActiveTag = (slug?: string) => !!selected && slug === selected;

  // Group the (already tag-filtered) posts into year buckets, newest year first.
  const postsByYear = $derived.by(() => {
    const groups = new Map<number, Post[]>();
    for (const p of data.posts) {
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
    data-sveltekit-preload-code="hover"
    data-sveltekit-preload-data="hover"
    data-sveltekit-replacestate
    data-sveltekit-noscroll
  >
    <span class="opacity-70 select-none">#</span>
    <span
      class="group-active:decoration-orange-light group-active:dark:decoration-orange-dark underline decoration-2 underline-offset-[3px] transition-[opacity,text-decoration-color,color] group-active:opacity-60"
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

{#snippet count()}
  <span
    class="font-mono text-base opacity-50"
    aria-label="{data.posts.length} posts total"
  >
    [ {String(data.posts.length).padStart(2, '0')} ]
  </span>
{/snippet}

<PageSection>
  <PageTitle>{data.content.title}</PageTitle>

  <div class="prose-links max-w-prose text-lg">
    <ThoughtsContent {count} />
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
  {#if data.posts.length}
    <div class="flex flex-col">
      {#each postsByYear as { year, posts: yearPosts } (year)}
        <section class="mb-8" in:listEnter out:listExit>
          <PostList posts={yearPosts} title={year} />
        </section>
      {/each}
    </div>
  {:else}
    <EmptyContent message="No posts found." />
  {/if}
</PageSection>
