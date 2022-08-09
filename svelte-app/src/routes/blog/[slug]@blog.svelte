<script lang="ts" context="module">
  import { post, findPost } from '@/stores/posts';

  export const load: import('@sveltejs/kit').Load = async ({
    fetch,
    params
  }) => {
    const now = performance.now();
    await findPost(fetch, { slug: params.slug })
      .then((res) => {
        post.set(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
    const delta = performance.now() - now;
    delta < 200 &&
      (await new Promise((resolve) => setTimeout(resolve, 200 - delta)));
  };
</script>

<script lang="ts">
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import { onDestroy } from 'svelte';

  let readingTime: number;
  let dateFormat = 'rel';
  let date: string;

  const getReadingTime = (post: any) => {
    if (!post || !post.body) {
      return 0;
    }

    const blocks = post.body
      ?.filter((block: any) => block._type === 'block')
      ?.reduce((prev: any[], item: any) => {
        return [...prev, item];
      }, []);

    let texts: string[] = [];

    blocks
      ?.filter((block: any) => block?.children?.length)
      ?.forEach((block: any) => {
        texts.push(
          block.children.reduce((prev: any[], item: any) => {
            if (item?.text?.length > 0) {
              return [...prev, item.text];
            }
          }, [])
        );
      });

    texts = texts.flat();
    texts = texts.filter((text: string) => text);

    const totalWords = texts.reduce((prev, item: any) => {
      return (prev += item.split(' ').length);
    }, 0);

    return Math.floor(totalWords / (100 / 60));
  };

  const getAbsDate = (date: string | undefined) => {
    if (!date) {
      return '...';
    }
    const d = new Date(date);
    const formatter = new Intl.DateTimeFormat('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const dateString = `${formatter.format(d)}`;
    return dateString;
  };

  const getRelDate = (date: string | undefined) => {
    if (!date) {
      return '...';
    }
    const d = new Date(date);
    const rtf = new Intl.RelativeTimeFormat('default', {
      numeric: 'auto'
    });

    const elapsed = Math.floor((new Date().getTime() - d.getTime()) / 1000),
      elapsedMin = Math.floor(elapsed / 60),
      elapsedH = Math.floor(elapsed / 3600),
      elapsedMth = Math.floor(elapsed / (3600 * 24 * 30)),
      elapsedY = Math.floor(elapsed / (3600 * 24 * 365));

    if (elapsedY > 0) {
      return `${rtf.format(-elapsedY, 'year')}`;
    } else if (elapsedMth > 0) {
      return `${rtf.format(-elapsedMth, 'month')}`;
    } else if (elapsedH > 0) {
      return `${rtf.format(-elapsedH, 'hour')}`;
    } else if (elapsedMin > 0) {
      return `${rtf.format(-elapsedMin, 'minute')}`;
    } else {
      return `${rtf.format(-elapsed, 'second')}`;
    }
  };

  const switchDate = () => {
    dateFormat = dateFormat === 'rel' ? 'abs' : 'rel';
    dateFormat === 'rel'
      ? (date = getAbsDate($post.date))
      : (date = getRelDate($post.date));
  };

  const unsubscribe = post.subscribe((post: any) => {
    readingTime = getReadingTime(post);
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
    <h1 class="font-code text-4xl my-8 font-bold">{$post.title}</h1>
    <div class="flex flex-col">
      <p class="text-md">{$post.desc}</p>
      <div class="flex flex-row my-2 items-center justify-start">
        <p class="font-mono text-md">By {$post.author.name}</p>
        <div class="h-1 w-1 rounded-full bg-slate-800 dark:bg-slate-100 mx-2" />
        <p
          class="font-mono text-md cursor-pointer"
          on:click={() => switchDate()}
        >
          {date ? date : '...'}
        </p>
        <div class="h-1 w-1 rounded-full bg-slate-800 dark:bg-slate-100 mx-2" />
        <p class="font-mono text-md">
          {readingTime ? `${Math.floor(readingTime / 60)} min read` : '...'}
        </p>
      </div>
    </div>

    <div class="mt-4 font-sans text-base">
      <PortableText text={$post.body} />
    </div>
  </div>
{/if}
