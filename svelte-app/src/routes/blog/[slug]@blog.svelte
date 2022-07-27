<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  import { postWritable as post, findPost } from '@/stores/posts';
  let isLoadingData = true;
  export const load: Load = async ({ params }) => {
    await findPost({ slug: params.slug })
      .then((res) => {
        post.set(res?.data);
        isLoadingData = false;
      })
      .catch((e) => {
        console.error(e);
      });
  };
</script>

<script lang="ts">
  import { Diamonds } from 'svelte-loading-spinners';
  import { theme } from '@/stores/theme';
  import PortableText from '@/components/portable-text/portable-text.svelte';
</script>

<svelte:head>
  <title>kio.dev | blog | {$post.title}</title>
</svelte:head>

{#if $post}
  <div class="w-96 mx-auto md:mx-48 md:w-auto">
    <h1 class="font-code text-4xl my-8 font-bold">{$post.title}</h1>
    <p class="font-sans mt-2 text-md">{$post.desc}</p>
    <div class="mt-4 font-sans text-base">
      <PortableText text={$post.body} />
    </div>
  </div>
{/if}
