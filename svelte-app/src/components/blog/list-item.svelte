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
      class="flex flex-col items-stretch justify-stretch w-full h-fit p-4 pl-5 {hovered
        ? 'bg-slate-300/50 dark:bg-slate-700/50'
        : 'bg-slate-200/50 dark:bg-slate-900/50'} rounded-2xl transition-[padding,background-color]"
      tabindex="0"
      role="button"
      aria-label="Post - {post.title}"
      data-test-id="list-item"
      href={linkTo(`/blog/${post.slug.current}`)}
      data-sveltekit-prefetch
      on:click={() => SFX.click.play()}
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
          <Tags model="post" data={post.tags} />
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
    </a>
  </Hoverable>
</ListItemWrapper>
