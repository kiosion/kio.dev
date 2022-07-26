<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  import { isLoadingPost, postWritable, queryPost } from '@/stores/posts';
  export const load: Load = async ({ params }) => {
    await queryPost({ slug: params.slug })
      .then((post) => {
        postWritable.set(post?.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
</script>

<script lang="ts">
  import type { Post } from '$lib/types';
  import { onDestroy } from 'svelte';
  import { Diamonds } from 'svelte-loading-spinners';
  import { theme } from '@/stores/theme';
  import { PortableText } from '@portabletext/svelte';

  export let post: Post;

  const unsubscribe = postWritable.subscribe((res) => {
    post = res;
    res ? isLoadingPost.set(false) : isLoadingPost.set(true);
  });

  onDestroy(() => {
    postWritable.set({});
    unsubscribe();
  });
</script>

{#if $isLoadingPost}
  <div class="absolute w-fit h-fit top-1/2 left-1/2 ml-24">
    <Diamonds size="38" color={$theme === 'light' ? '#1E293B' : '#F1F5F9'} />
  </div>
{:else}
  <h1 class="font-code text-4xl my-8 font-bold">{post.title}</h1>
  <p class="font-sans mt-2 text-md">{post.desc}</p>
  <div class="font-sans mt-4 text-base">
    <PortableText value={post.body} />
  </div>
{/if}
