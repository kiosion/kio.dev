<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  import { postWritable, queryPost } from '@/stores/posts';
  export const load: Load = async ({ params }) => {
    queryPost({ slug: params.slug })
      .then((posts) => {
        postWritable.set(posts);
      })
      .catch(() => {
        noop;
      });
  };
</script>

<script lang="ts">
  import type { Post } from '$lib/types';
  import { onDestroy } from 'svelte';
  import { noop } from 'svelte/internal';
  // import { postableText } from '@portabletext/svelte';

  export let post: Post;

  const unsubscribe = postWritable.subscribe((res) => {
    post = res;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<h1>Title</h1>
<p>Subtitle or something</p>
<div>Main content or something</div>
