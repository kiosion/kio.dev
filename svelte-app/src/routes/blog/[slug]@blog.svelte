<script lang="ts" context="module">
  import { post, findPost } from '@/stores/posts';
  import Logger from '$lib/logger';

  export const load: import('@sveltejs/kit').Load = async ({
    fetch,
    params
  }) => {
    await findPost(fetch, { slug: params.slug })
      .then((res) => {
        post.set(res);
      })
      .catch((e) => {
        Logger.error(e, `routes/blog/${params.slug}`);
      });
  };
</script>

<script lang="ts">
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { getAbsDate, getRelDate, getReadingTime } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/post';
  import Divider from '@/components/divider.svelte';
  import BulletPoint from '@/components/bullet-point.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import type { TextBlock, ResData } from '$lib/types';
  import twemoji from 'twemoji';

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
    twemoji.parse(body);
    body.querySelectorAll('img.emoji').forEach((emoji: Element) => {
      if (!emoji?.style) {
        return;
      }
      emoji.style.display = 'inline-block';
      emoji.style.width = '1.1em';
      emoji.style.height = '1.1em';
      emoji.style.marginBottom = '0.15em';
      emoji.style.marginRight = '0.05em';
      emoji.style.verticalAlign = '-0.1em';
    });
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
          <p class="font-mono text-base">
            <a href="/about" alt="About"
              >By {$post.data?.author?.name
                ? $post.data.author.name
                : 'Unknown'}</a
            >
          </p>
          <BulletPoint />
          <p
            class="font-mono text-base cursor-pointer"
            on:click={() => switchDate()}
          >
            {date ? date : '...'}
          </p>
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
