<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import BulletPoint from '../bullet-point.svelte';
  import { getTotalWords } from '$lib/helpers/pt';
  import { getAbsDate, getReadingTime } from '$lib/helpers/date';
  import type { PostDocument } from '$types';
  import { goto } from '$app/navigation';
  import Hoverable from '$components/hoverable.svelte';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import Tags from '$components/tags.svelte';

  export let post: PostDocument;

  let hovered: boolean;
  let readingTime = getReadingTime(getTotalWords(post.body));

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      SFX.click.play();
      goto(linkTo(`/blog/${post.slug.current}`) as string).catch(
        () => undefined
      );
    }
  };

  $: date = getAbsDate(post.date);
</script>

<ListItemWrapper>
  <Hoverable bind:hovered>
    <a
      class="flex flex-col items-stretch justify-stretch gap-y-2 w-full h-fit py-5 px-6 pl-5 {hovered
        ? 'bg-slate-300/25 dark:bg-slate-700/25 border-slate-300/90 dark:border-slate-700/90'
        : 'bg-slate-200/25 dark:bg-slate-900/25 border-slate-300/60 dark:border-slate-700/60'} border-[1px] -ml-[1px] -mt[1px] rounded-2xl transition-colors focusOutline"
      tabindex="0"
      role="button"
      aria-label="Post - {post.title}"
      data-test-id="list-item"
      href={linkTo(`/blog/${post.slug.current}`)}
      data-sveltekit-preload-data
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
          class="my-0.5 mr-4 overflow-hidden font-sans text-base w-fit text-ellipsis text-slate-700 dark:text-slate-200 line-clamp-1 md:line-clamp-2"
        >
          {post.desc}
        </p>
      {/if}
      <div
        class="flex flex-row flex-wrap items-center justify-start w-full font-sans text-sm text-slate-700 dark:text-slate-200 gap-y-2"
      >
        {#if date}
          <p>{date}</p>
          <BulletPoint colors="bg-slate-600 dark:bg-slate-300" />
        {/if}
        <p>{`${Math.floor(readingTime / 60)} min read`}</p>
        {#if post.tags}
          <BulletPoint colors="bg-slate-600 dark:bg-slate-300" />
          <Tags model="post" data={post.tags} />
        {/if}
      </div>
    </a>
  </Hoverable>
</ListItemWrapper>
