<script lang="ts">
  import { goto } from '$app/navigation';
  import { urlFor, getCrop, type ImageCrop } from '$lib/helpers/image';
  import { getAbsDate, getRelDate, getReadingTime } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/post';
  import type { TextBlock, PostDocument } from '$lib/types';
  import BulletPoint from '$components/bullet-point.svelte';
  import Divider from '$components/divider.svelte';

  export let post: PostDocument;

  let date = getRelDate(post.date);
  let dateFormat = 'rel';
  let readingTime = getReadingTime(
    getTotalWords(post.body as Array<TextBlock>)
  );

  const switchDate = () => {
    dateFormat === 'rel'
      ? (date = getAbsDate(post.date))
      : (date = getRelDate(post.date));
    dateFormat = dateFormat === 'rel' ? 'abs' : 'rel';
  };

  const title = post.title;
  const desc = post.desc;

  $: author = post?.author;
  $: _ref = author?.image?.asset?._ref;
  $: pfpCrop = author?.image && getCrop(author.image);
</script>

<div class="mb-4" data-test-id="post-header">
  <div class="flex flex-col">
    <h1 class="font-display text-5xl mb-6 font-bold">{title}</h1>
    {#if post.tags}
      <div class="flex flex-row justify-start items-center gap-2 mb-6">
        {#each post.tags as tag}
          <a
            href="/blog/{tag.slug.current}"
            class="font-code text-base capitalize px-2 py-1 bg-slate-200 dark:bg-slate-900 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-900/50 transition-colors"
          >
            {tag.title}
          </a>
        {/each}
      </div>
    {/if}
    <div class="flex flex-row items-center justify-start">
      <button
        class="flex flex-row gap-2 items-center font-mono text-base"
        on:click={() => goto('/about')}
        tabindex="0"
      >
        <div class="h-8 aspect-square">
          {#if _ref && pfpCrop}
            <img
              class="rounded-full aspect-square h-full"
              src={urlFor(_ref)
                .size(50, 50)
                .rect(pfpCrop.left, pfpCrop.top, pfpCrop.width, pfpCrop.height)
                .fit('crop')
                .format('webp')
                .url()}
              alt="Profile pic"
              draggable="false"
            />
          {/if}
        </div>
        <p class="w-fit whitespace-nowrap">
          By {author?.name ? author.name : 'Unknown'}
        </p>
      </button>
      <BulletPoint />
      <button
        class="inline font-mono text-base cursor-pointer select-none"
        on:click={() => switchDate()}
        tabindex="0"
      >
        {date ? date : '...'}
      </button>
      <BulletPoint />
      <p class="font-mono text-base">
        {`${Math.floor(readingTime / 60)} min read`}
      </p>
    </div>

    {#if desc}
      <p class="mt-4 font-mono text-base">{desc}</p>
    {/if}
  </div>
  <Divider />
</div>
