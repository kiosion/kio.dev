<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import BulletPoint from '../bullet-point.svelte';
  import { getTotalWords } from '$lib/helpers/pt';
  import { getAbsDate, getReadingTime } from '$lib/helpers/date';
  import type { PostDocument } from '$lib/types';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import Features from '$stores/features';
  import { goto } from '$app/navigation';
  import Hoverable from '$components/hoverable.svelte';

  export let post: PostDocument;

  let click: UIfx;
  let hovered: boolean;
  let readingTime = getReadingTime(getTotalWords(post.body));

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  const onClick = () => {
    $CanUseSounds && click.play();
    goto(`/blog/${post.slug.current}`);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };

  $: date = getAbsDate(post.date);
  $: CanUseSounds = Features.can('use sounds feature');
</script>

<ListItemWrapper>
  {#if post}
    <!-- <div
      class="absolute top-4 left-3 h-[calc(100%_-_28px)] {hovered
        ? 'w-[2px]'
        : 'w-0'} bg-emerald-400 dark:bg-emerald-300 transition-[width]"
      aria-hidden="true"
    >
      &nbsp;
    </div> -->
    <Hoverable bind:hovered>
      <section
        class="flex flex-col items-stretch justify-stretch w-full h-fit p-4 pl-5 {hovered
          ? 'bg-slate-300/50 dark:bg-slate-700/50'
          : 'bg-slate-200/50 dark:bg-slate-900/50'} rounded-2xl transition-[padding,background-color]"
        tabindex="0"
        role="button"
        aria-label="Post - {post.title}"
        data-test-id="list-item"
        on:click={onClick}
        on:keydown={onKey}
      >
        <div
          class="flex flex-row flex-wrap items-center justify-start w-full font-sans text-base text-slate-700 dark:text-slate-200 gap-y-2"
        >
          {#if date}
            <p>{date}</p>
            <BulletPoint colors="bg-slate-600 dark:bg-slate-300" />
          {/if}
          <p>{`${Math.floor(readingTime / 60)} min read`}</p>
          {#if post.tags}
            <BulletPoint colors="bg-slate-600 dark:bg-slate-300" />
            <div
              class="flex flex-row flex-wrap items-center justify-start gap-2"
            >
              {#each post.tags as tag}
                <a href="/blog/+/{tag.slug.current}" class="categoryTag-sm">
                  {tag.title}
                </a>
              {/each}
            </div>
          {/if}
        </div>
        <h1
          class="w-full pt-2 text-2xl font-bold text-ellipsis font-display line-clamp-1 decoration-emerald-300 decoration-[3px] {hovered
            ? 'underline'
            : ''}"
        >
          {post.title}
        </h1>
        {#if post.desc}
          <p
            class="pt-2 mr-4 overflow-hidden font-sans text-base w-fit text-ellipsis text-slate-700 dark:text-slate-200 line-clamp-1 md:line-clamp-2"
          >
            {post.desc}
          </p>
        {/if}
      </section>
    </Hoverable>
  {:else}
    <section
      class="flex flex-col items-stretch w-full p-4 duration-150 rounded-md justify-stretch h-fit max-h-40 bg-slate-200 dark:bg-slate-900"
      data-test-id="list-item"
      aria-label="No results"
    >
      <h3 class="my-2 font-sans text-base text-center">No results found</h3>
    </section>
  {/if}
</ListItemWrapper>
