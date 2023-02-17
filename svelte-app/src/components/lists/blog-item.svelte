<script lang="ts">
  import BulletPoint from '../bullet-point.svelte';
  import { getTotalWords } from '$lib/helpers/pt';
  import { formatDate, getReadingTime } from '$lib/helpers/date';
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

  $: date = formatDate(post.date, 'full');
</script>

<Hoverable bind:hovered>
  <a
    class="justify-stretch flex h-fit w-full flex-col items-stretch gap-y-1.5 border px-6 pl-5 {getClassNames(
      position
    )} {hovered
      ? 'border-stone-400/80 bg-stone-300/60 dark:border-stone-500/80 dark:bg-stone-700/20'
      : 'border-stone-400/60 bg-stone-300/20 dark:border-stone-500/60 dark:bg-stone-900/40'} focusOutline -ml-[1px] transition-colors"
    tabindex="0"
    role="button"
    aria-label="Post - {post.title}"
    data-test-id="list-item"
    href={linkTo(`/blog/${post.slug.current}`)}
    data-sveltekit-preload-code
    on:click={() => SFX.click.play()}
    on:keydown={onKey}
  >
    <h1
      class="w-full text-ellipsis font-display text-xl font-bold decoration-[2px] underline-offset-[3px] line-clamp-1 {hovered
        ? 'underline'
        : ''}"
    >
      {post.title}
    </h1>
    {#if post.desc}
      <p
        class="my-0.5 mr-4 w-fit overflow-hidden text-ellipsis font-sans text-base text-gray-700 line-clamp-1 dark:text-gray-200 md:line-clamp-2"
      >
        {post.desc}
      </p>
    {/if}
    <div
      class="flex w-full flex-row flex-wrap items-center justify-start gap-y-2 font-sans text-sm text-gray-700 dark:text-gray-200"
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
