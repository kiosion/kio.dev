<script lang="ts" context="module">
  import { postWritable as post, findPost } from '@/stores/posts';

  // let isLoadingData = true;

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
</script>

<svelte:head>
  <title>kio.dev | blog{$post ? ` | ${$post.title}` : ''}</title>
</svelte:head>

{#if $post}
  <div
    class="w-full max-w-[28rem] px-4 mx-auto md:px-0 md:max-w-none md:w-[24rem] lg:w-[32rem] xl:w-[38rem] 2xl:w-[42rem]"
  >
    <h1 class="font-code text-4xl my-8 font-bold">{$post.title}</h1>
    <p class="font-sans mt-2 text-md">{$post.desc}</p>
    <div class="mt-4 font-sans text-base">
      <PortableText text={$post.body} />
    </div>
  </div>
{/if}
