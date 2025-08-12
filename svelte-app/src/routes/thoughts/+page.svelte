<script lang="ts">
  import { t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';
  import PostList from '$components/new/post-list.svelte';

  import type { Tag } from '$types/sanity';

  export let data;

  $: description = $t('pages.thoughts.description');

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
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta itemprop="name" content={$pageTitle} />
  <meta itemprop="description" content={description} />
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={$pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:title" content={$pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

{#snippet tagItem(tag: typeof tags[number])}
  <a
    class="group flex flex-row items-center justify-start gap-x-0.5"
    href={`/thoughts/+/${tag.slug?.current}`}
    data-sveltekit-preload-code
    data-sveltekit-preload-data
    aria-label={'Topic' + ': ' + tag.title}
  >
    <span class="opacity-70 select-none">#</span>
    <span
      class="group-hover:underline group-hover:opacity-100 opacity-70 underline-offset-4 decoration-orange-light dark:decoration-orange-dark decoration-2 transition-opacity"
    >{tag.title?.toLowerCase()}</span>
  </a>
{/snippet}

<div class="flex flex-col flex-grow gap-20 h-full min-w-full">
  <section class="flex flex-row flex-wrap items-start justify-between w-full mt-10 gap-y-12">
    <div class="flex flex-col gap-8 mr-auto">
      <div class="flex flex-col gap-2 text-5xl font-display tracking-wide max-w-2xl">
        <h1>Thoughts &amp; guides</h1>
      </div>
      <div class="pl-1 text-lg max-w-prose flex flex-row flex-wrap items-center justify-start gap-3">
        {#each tags as tag}
          {@render tagItem(tag)}
        {/each}
      </div>
    </div>
  </section>

  <section class="flex flex-col gap-2">
    <h2 class="text-base tracking-wide opacity-70">
      All posts
    </h2>
    <PostList posts={data.posts} />
  </section>
</div>
