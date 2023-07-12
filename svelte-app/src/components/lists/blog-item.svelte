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
        return 'rounded-t-md mt-2 pb-4 pt-5';
      case 'middle':
        return 'py-4 -mt-[1px]';
      case 'last':
        return 'rounded-b-md mb-2 pt-4 pb-5 -mt-[1px]';
      case 'solo':
        return 'rounded-md my-2 py-4';
    }
  };

  $: date = formatDate(post.date, 'full');
</script>

<Hoverable bind:hovered>
  <a
    class="flex h-fit w-full flex-col items-stretch justify-stretch gap-y-1.5 border px-6 pl-5 {getClassNames(
      position
    )} {hovered
      ? 'border-dark/60 bg-dark/10 dark:border-light/60 dark:bg-dark/40'
      : 'border-dark/40 bg-dark/5 dark:border-light/40 dark:bg-dark/20'} focusOutline -ml-[1px] transition-[background-color,border-color]"
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
        class="my-0.5 mr-4 line-clamp-1 w-fit overflow-hidden text-ellipsis font-sans text-base text-dark/80 dark:text-light/90 md:line-clamp-2"
      >
        {post.desc}
      </p>
    {/if}
    <div
      class="flex w-full flex-row flex-wrap items-center justify-start gap-y-2 font-sans text-sm text-dark/80 dark:text-light/90"
    >
      {#if date}
        <p>{date}</p>
        <BulletPoint />
      {/if}
      <p>{$t('{length} min read', { length: Math.floor(readingTime / 60) })}</p>
      {#if post.tags?.length}
        <BulletPoint />
        <Tags model="post" data={post.tags} />
      {/if}
    </div>
  </a>
</Hoverable>
