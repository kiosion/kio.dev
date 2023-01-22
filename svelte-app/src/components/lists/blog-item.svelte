<script lang="ts">
  import BulletPoint from '../bullet-point.svelte';
  import { getTotalWords } from '$lib/helpers/pt';
  import { getAbsDate, getReadingTime } from '$lib/helpers/date';
  import type { PostDocument, PTBlock } from '$types';
  import { goto } from '$app/navigation';
  import Hoverable from '$components/hoverable.svelte';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import Tags from '$components/tags.svelte';

  export let post: PostDocument,
    position: 'first' | 'last' | 'middle' | 'solo' = 'solo';

  let hovered: boolean;
  let readingTime = getReadingTime(
    getTotalWords((post.body ?? []) as PTBlock[])
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      SFX.click.play();
      goto(linkTo(`/blog/${post.slug.current}`)).catch(() => undefined);
    }
  };

  const getClassNames = (pos: typeof position) => {
    switch (pos) {
      case 'first':
        return 'rounded-t-2xl mt-2 pb-4 pt-5';
      case 'middle':
        return 'py-4 -mt-[1px]';
      case 'last':
        return 'rounded-b-2xl mb-2 pt-4 pb-5 -mt-[1px]';
      case 'solo':
        return 'rounded-2xl my-2 py-4';
    }
  };

  $: date = getAbsDate(post.date);
</script>

<Hoverable bind:hovered>
  <a
    class="flex flex-col items-stretch justify-stretch gap-y-1.5 w-full h-fit px-6 pl-5 border {getClassNames(
      position
    )} {hovered
      ? 'bg-stone-300/60 dark:bg-stone-700/20 border-stone-400/80 dark:border-stone-500/80'
      : 'bg-stone-300/20 dark:bg-stone-900/40 border-stone-400/60 dark:border-stone-500/60'} -ml-[1px] transition-colors focusOutline"
    tabindex="0"
    role="button"
    aria-label="Post - {post.title}"
    data-test-id="list-item"
    href={linkTo(`/blog/${post.slug.current}`)}
    data-sveltekit-preload-data
    data-sveltekit-preload-code
    on:click={() => SFX.click.play()}
    on:keydown={onKey}
  >
    <h1
      class="w-full text-xl font-bold text-ellipsis font-display line-clamp-1 underline-offset-[3px] decoration-[2px] {hovered
        ? 'underline'
        : ''}"
    >
      {post.title}
    </h1>
    {#if post.desc}
      <p
        class="my-0.5 mr-4 overflow-hidden font-sans text-base w-fit text-ellipsis text-gray-700 dark:text-gray-200 line-clamp-1 md:line-clamp-2"
      >
        {post.desc}
      </p>
    {/if}
    <div
      class="flex flex-row flex-wrap items-center justify-start w-full font-sans text-sm text-gray-700 dark:text-gray-200 gap-y-2"
    >
      {#if date}
        <p>{date}</p>
        <BulletPoint colors="bg-gray-600 dark:bg-gray-300" />
      {/if}
      <p>{t('{length} min read', { length: Math.floor(readingTime / 60) })}</p>
      {#if post.tags && post.tags.length > 0}
        <BulletPoint colors="bg-gray-600 dark:bg-gray-300" />
        <Tags model="post" data={post.tags} />
      {/if}
    </div>
  </a>
</Hoverable>
