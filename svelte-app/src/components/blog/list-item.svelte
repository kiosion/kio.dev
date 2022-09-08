<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import BulletPoint from '../bullet-point.svelte';
  import { getTotalWords } from '$lib/helpers/post';
  import { getAbsDate, getReadingTime } from '$lib/helpers/date';
  import type { PostDocument } from '@/lib/types';
  import type { TextBlock } from '$lib/types';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '$stores/features';
  import { goto } from '$app/navigation';

  export let post: PostDocument;
  export let mousePos = [0, 0];

  let click: UIfx;
  let hovered = false;
  let readingTime = getReadingTime(
    getTotalWords(post.body as Array<TextBlock>)
  );

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  $: date = getAbsDate(post.date);
</script>

<ListItemWrapper {hovered} {mousePos} wrapperClass="mt-6">
  {#if post}
    <div
      class="rounded-xl"
      tabindex="0"
      role="button"
      aria-label="Post - {post.title}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
      on:click={() => {
        $sounds === 'on' && click?.play();
        goto(`/blog/${post.slug.current}`);
      }}
    >
      <section
        class="flex flex-col items-stretch justify-stretch w-full h-fit max-h-40 p-4 roundedCard-lg"
        data-test-id="list-item"
        on:focus={() => (hovered = true)}
        on:blur={() => (hovered = false)}
      >
        <h1
          class="block overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-xl"
        >
          {post.title}
        </h1>
        <div
          class="flex flex-row flex-wrap items-center justify-start w-full font-sans text-base text-slate-700 dark:text-slate-200 mt-1"
        >
          {#if date}
            <p>{date}</p>
            <BulletPoint colors="bg-slate-600 dark:bg-slate-300" />
          {/if}
          <p>{`${Math.floor(readingTime / 60)} min read`}</p>
          {#if post.tags}
            <BulletPoint />
            <div
              class="flex flex-row justify-start items-center gap-2 flex-wrap"
            >
              {#each post.tags as tag}
                <a href="/blog/t/{tag.slug.current}" class="categoryTag-sm">
                  {tag.title}
                </a>
              {/each}
            </div>
          {/if}
        </div>
        {#if post.desc}
          <div class="relative flex flex-row align-center justify-start mt-2">
            <p
              class="overflow-hidden w-fit mr-4 text-ellipsis font-sans text-base line-clamp-2"
            >
              {post.desc}
            </p>
          </div>
        {/if}
      </section>
    </div>
  {:else}
    <section
      class="flex flex-col items-stretch justify-stretch w-full h-fit max-h-40 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
      data-test-id="list-item"
      aria-label="No results"
    >
      <h3 class="text-center font-sans text-base my-2">No results found</h3>
    </section>
  {/if}
</ListItemWrapper>
