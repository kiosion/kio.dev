<script lang="ts">
  import { page } from '$app/state';
  import PostList from '$components/new/post-list.svelte';
  import type { Post } from '$lib/posts';

  type Tag = { slug: string; title: string; count?: number };

  let {
    posts: unfilteredPosts,
    tags,
    filter = true,
  }: {
    posts: Post[];
    tags: Tag[];
    filter?: boolean;
  } = $props();

  const selected = $derived(page.params.slug);

  const isActiveTag = (slug?: string) => filter && !!selected && slug === selected;

  const filterByTag = $derived.by(
    () => (slug: string) =>
      (unfilteredPosts ?? []).filter((p) =>
        (p.tags ?? []).some(
          (t) =>
            t
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') === slug,
        ),
      ),
  );

  const posts = $derived.by(() => {
    if (!filter || !selected) {
      return unfilteredPosts ?? [];
    }
    return filterByTag(selected);
  });
</script>

{#snippet tagItem(tag: Tag)}
  <a
    class="group flex flex-row items-center justify-start gap-x-0.5"
    href={isActiveTag(tag.slug) ? '/thoughts' : `/thoughts/+/${tag.slug}`}
    aria-current={isActiveTag(tag.slug) ? 'page' : undefined}
    data-sveltekit-preload-code="eager"
    data-sveltekit-preload-data="hover"
    data-sveltekit-replacestate
    data-sveltekit-noscroll>
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
      class:group-hover:dark:decoration-orange-dark={!isActiveTag(tag.slug)}>
      {tag.title?.toLowerCase()}</span>
  </a>
{/snippet}

<section class="mt-8 flex w-full flex-row flex-wrap items-start justify-between gap-y-12">
  <div class="mr-auto flex flex-col gap-8">
    <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
      Thoughts &amp; guides
    </h1>

    {#if tags.length}
      <div
        class="flex max-w-prose flex-row flex-wrap items-center justify-start gap-3 pl-1 text-lg">
        {#each tags as tag}
          {@render tagItem(tag)}
        {/each}
      </div>
    {/if}
  </div>
</section>

<section class="flex flex-col gap-2">
  <span class="text-base tracking-wide">
    {#if filter && selected}
      <span class="opacity-70"
        >{posts.length ?? '-'}&nbsp;matching&nbsp;post{posts.length === 1
          ? ''
          : 's'}</span>
      <a
        href="/thoughts"
        class="inline-block cursor-pointer text-base opacity-70 transition-opacity hover:opacity-100"
        data-sveltekit-preload-code="eager"
        data-sveltekit-preload-data="hover"
        data-sveltekit-replacestate
        data-sveltekit-noscroll>&nbsp;&mdash;&nbsp;clear</a>
    {:else}
      <span class="opacity-70">All posts</span>
    {/if}
  </span>

  <PostList {posts} />
</section>
