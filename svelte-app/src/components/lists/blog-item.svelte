<script lang="ts">
  import { goto } from '$app/navigation';
  import { linkTo, t } from '$i18n';
  import { formatDate, getReadingTime } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/pt';
  import SFX from '$lib/sfx';

  import Hoverable from '$components/hoverable.svelte';
  import Tags from '$components/tags.svelte';

  import BulletPoint from '../bullet-point.svelte';

  import type { PostDocument, PTBlock } from '$types';

  export let post: PostDocument,
    position: 'first' | 'last' | 'middle' | 'solo' = 'solo';

  let hovered: boolean;
  let readingTime = getReadingTime(getTotalWords((post.body ?? []) as PTBlock[]));

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      SFX.click.play();
      goto($linkTo(`/blog/${post.slug.current}`)).catch(() => undefined);
    }
  };

  const getClassNames = (pos: typeof position) => {
    switch (pos) {
      case 'first':
        return 'rounded-t-xl mt-2 pb-4 pt-5';
      case 'middle':
        return 'py-4 -mt-[1px]';
      case 'last':
        return 'rounded-b-xl mb-2 pt-4 pb-5 -mt-[1px]';
      case 'solo':
        return 'rounded-xl my-2 py-4';
    }
  };

  $: console.log('got post:', post);
  $: date = formatDate(post.date, 'full');
</script>

<Hoverable bind:hovered>
  <a
    class="flex h-fit w-full flex-col items-stretch justify-stretch gap-y-1.5 border px-6 pl-5 {getClassNames(
      position
    )} {hovered
      ? 'border-stone-400/80 bg-stone-200/80 dark:border-stone-500/80 dark:bg-stone-700/20'
      : 'border-stone-400/60 bg-stone-200/40 dark:border-stone-500/60 dark:bg-stone-900/40'} focusOutline -ml-[1px] transition-[background-color]"
    tabindex="0"
    role="button"
    aria-label="Post - {post.title}"
    data-test-id="list-item"
    href={$linkTo(`/blog/${post.slug.current}`)}
    data-sveltekit-preload-code
    on:click={() => SFX.click.play()}
    on:keydown={onKey}
  >
    <h1
      class="line-clamp-1 w-full text-ellipsis font-display text-xl font-bold decoration-[2px] underline-offset-[3px] {hovered
        ? 'underline'
        : ''}"
    >
      {post.title}
    </h1>
    {#if post.desc}
      <p
        class="my-0.5 mr-4 line-clamp-1 w-fit overflow-hidden text-ellipsis font-sans text-base text-stone-700 dark:text-stone-200 md:line-clamp-2"
      >
        {post.desc}
      </p>
    {/if}
    <div
      class="flex w-full flex-row flex-wrap items-center justify-start gap-y-2 font-sans text-sm text-stone-700 dark:text-stone-200"
    >
      {#if date}
        <p>{date}</p>
        <BulletPoint colors="bg-stone-600 dark:bg-stone-300" />
      {/if}
      <p>{$t('{length} min read', { length: Math.floor(readingTime / 60) })}</p>
      {#if post.tags && post.tags.length > 0}
        <BulletPoint colors="bg-stone-600 dark:bg-stone-300" />
        <Tags model="post" data={post.tags} />
      {/if}
    </div>
  </a>
</Hoverable>
