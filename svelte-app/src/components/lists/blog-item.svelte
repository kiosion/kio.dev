<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentLang, linkTo, t } from '$i18n';
  import { formatDate, getReadingTime } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/pt';

  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Tags from '$components/tags.svelte';

  import type { PostDocument, PTBlock } from '$types';

  export let post: PostDocument;

  let hovered: boolean;
  let readingTime = getReadingTime(getTotalWords((post.body ?? []) as PTBlock[]));

  const onClick = (e: MouseEvent | KeyboardEvent) => {
      e.preventDefault();
      goto($linkTo(`/blog/${post.slug.current}`)).catch(() => undefined);
    },
    onKey = (e: KeyboardEvent) => e.code === 'Enter' && onClick(e);

  $: date = formatDate(post.date, 'full', $currentLang);
</script>

<Hoverable bind:hovered>
  <button
    class="flex h-fit w-full flex-col items-stretch justify-stretch gap-y-1.5 rounded-md border px-6 py-5 pl-5 {hovered
      ? 'border-dark/60 bg-dark/10 dark:border-light/60 dark:bg-dark/40'
      : 'border-dark/40 bg-dark/5 dark:border-light/40 dark:bg-dark/20'} focusOutline -ml-[1px] transition-[background-color,border-color]"
    tabindex="0"
    aria-label="Post - {post.title}"
    data-test-id="list-item"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
    on:click={onClick}
    on:keydown={onKey}
  >
    <h1
      class="line-clamp-2 w-full text-ellipsis text-left font-display text-xl font-bold decoration-[2px] underline-offset-[3px] lg:text-2xl {hovered
        ? 'underline'
        : ''}"
    >
      {post.title}
    </h1>
    <div
      class="mt-0.5 flex w-full flex-row flex-wrap items-center justify-start gap-y-2 font-sans text-sm text-dark/80 dark:text-light/90"
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
  </button>
</Hoverable>
