<script lang="ts" context="module">
  import { post, findPost } from '@/stores/posts';

  export const load: import('@sveltejs/kit').Load = async ({
    fetch,
    params
  }) => {
    await findPost(fetch, { slug: params.slug })
      .then((res) => {
        post.set(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
</script>

<script lang="ts">
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import { onDestroy } from 'svelte';
  import { getAbsDate, getRelDate, getReadingTime } from '$lib/helpers/date';
  import Divider from '@/components/divider.svelte';
  import BulletPoint from '@/components/bullet-point.svelte';

  let readingTime: number;
  let dateFormat = 'rel';
  let date: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTotalWords = (postBody: any) => {
    if (!postBody) {
      return [];
    }

    const blocks = postBody
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.filter((block: any) => block._type === 'block')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.reduce((prev: any[], item: any) => {
        return [...prev, item];
      }, []);

    let text: string[] = [];

    blocks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.filter((block: any) => block?.children?.length)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.forEach((block: any) => {
        text.push(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          block.children.reduce((prev: any[], item: any) => {
            if (item?.text?.length > 0) {
              return [...prev, item.text];
            }
          }, [])
        );
      });

    return text.flat().filter((text: string) => text);
  };

  const switchDate = () => {
    dateFormat === 'rel'
      ? (date = getAbsDate($post.date))
      : (date = getRelDate($post.date));
    dateFormat = dateFormat === 'rel' ? 'abs' : 'rel';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unsubscribe = post.subscribe((post: any) => {
    readingTime = getReadingTime(getTotalWords(post.body));
    date = getRelDate(post.date);
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<svelte:head>
  <title>kio.dev | blog{$post ? ` | ${$post.title}` : ''}</title>
</svelte:head>

{#if $post}
  <div
    class="w-full max-w-[28rem] px-4 mx-auto md:px-0 md:max-w-none md:w-[24rem] lg:w-[32rem] xl:w-[38rem] 2xl:w-[42rem]"
  >
    <div class="mt-8 mb-4" data-test-id="post-head">
      <h1 class="font-code text-4xl mb-6 font-bold">{$post.title}</h1>
      <div class="flex flex-col">
        {#if $post.desc}
          <p class="font-mono text-base">{$post.desc}</p>
        {/if}
        <div class="flex flex-row mt-4 items-center justify-start">
          <p class="font-mono text-base">
            <a href="/about" alt="About">By {$post.author.name}</a>
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
            {readingTime ? `${Math.floor(readingTime / 60)} min read` : '...'}
          </p>
        </div>
      </div>
      <Divider />
    </div>

    <div class="mt-4 font-sans text-base">
      <PortableText text={$post.body} />
    </div>
  </div>
{/if}
