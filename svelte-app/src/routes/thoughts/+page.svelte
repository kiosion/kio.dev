<script lang="ts">
  import PostList from '$components/new/post-list.svelte';
  import { PageMeta } from '$lib/nav.svelte';
  import type { Tag } from '$types/sanity';

  const { data } = $props();

  const tags: Pick<Tag, '_id' | 'slug' | 'title'>[] = [],
    tagCounts: Record<Tag['_id'], number> = {};

  for (let i = 0; i < data.posts?.length; i++) {
    const postTags = data.posts[i]?.tags ?? [];

    if (!postTags.length) {
      continue;
    }

    for (let j = 0; j < postTags.length; j++) {
      const tag = postTags[j];
      tagCounts[tag._id] = (tagCounts[tag._id] ?? 0) + 1;

      if (tagCounts[tag._id] === 1) {
        tags.push(tag);
      }
    }
  }

  for (let i = 1; i < tags.length; i++) {
    const currentTag = tags[i];
    const currentCount = tagCounts[currentTag._id];
    let j = i - 1;

    // Find the correct position for the currentTag
    while (
      j >= 0 &&
      (tagCounts[tags[j]._id] < currentCount ||
        (tagCounts[tags[j]._id] === currentCount &&
          tags[j]?.title?.localeCompare(currentTag.title) > 0))
    ) {
      tags[j + 1] = tags[j];
      j--;
    }

    tags[j + 1] = currentTag;
  }

  PageMeta.desc = data.config.meta?.thoughts?.desc ?? '';
</script>

<svelte:head>
  <meta name="robots" content="index, follow" />
</svelte:head>

{#snippet tagItem(tag: (typeof tags)[number])}
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

<div class="flex h-full min-w-full flex-grow flex-col gap-20">
  <section
    class="mt-10 flex w-full flex-row flex-wrap items-start justify-between gap-y-12"
  >
    <div class="mr-auto flex flex-col gap-8">
      <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
        Thoughts &amp; guides
      </h1>
      <div
        class="flex max-w-prose flex-row flex-wrap items-center justify-start gap-3 pl-1 text-lg"
      >
        {#each tags as tag}
          {@render tagItem(tag)}
        {/each}
      </div>
    </div>
  </section>

  <section class="flex flex-col gap-2">
    <h2 class="text-base tracking-wide opacity-70">All posts</h2>
    <PostList posts={data.posts} />
  </section>
</div>
