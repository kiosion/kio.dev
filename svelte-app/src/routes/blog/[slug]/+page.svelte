<script lang="ts">
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { getAbsDate, getRelDate, getReadingTime } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/post';
  import Divider from '@/components/divider.svelte';
  import BulletPoint from '@/components/bullet-point.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import type { TextBlock, ResData } from '$lib/types';
  import { post } from '@/stores/posts';
  import { parseEmoji } from '$lib/helpers/emoji';
  import { goto } from '$app/navigation';

  let readingTime: number;
  let dateFormat = 'rel';
  let date: string;
  let title: string;
  let body: HTMLElement;

  const switchDate = () => {
    dateFormat === 'rel'
      ? (date = getAbsDate($post.data.date))
      : (date = getRelDate($post.data.date));
    dateFormat = dateFormat === 'rel' ? 'abs' : 'rel';
  };

  const unsubscribe = post.subscribe((post: ResData) => {
    if (!post.data) {
      return;
    }
    readingTime = getReadingTime(
      getTotalWords(post.data.body as Array<TextBlock>)
    );
    date = getRelDate(post.data.date);
    title = post.data.title;
  });

  onMount(() => {
    parseEmoji(body);
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<svelte:head>
  <title>kio.dev | blog{title ? ` | ${title}` : ''}</title>
</svelte:head>

{#if $post?.data}
  <ContentWrapper>
    <div class="mt-8 mb-4" data-test-id="post-head" bind:this={body}>
      <h1 class="font-code text-4xl mb-6 font-bold">{$post.data.title}</h1>
      <div class="flex flex-col">
        {#if $post.data.desc}
          <p class="font-mono text-base">{$post.data.desc}</p>
        {/if}
        <div class="flex flex-row mt-4 items-center justify-start">
          <button
            class="inline font-mono text-base"
            on:click={() => goto('/about')}
            tabindex="0"
            >By {$post.data?.author?.name
              ? $post.data.author.name
              : 'Unknown'}</button
          >
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
      </div>
      <Divider />
    </div>

    <div class="mt-4 font-sans text-base">
      <PortableText text={$post.data.body} />
    </div>
  </ContentWrapper>
{/if}
