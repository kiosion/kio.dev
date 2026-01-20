<script lang="ts">
  import { page } from '$app/state';
  import PostContent from '$components/pages/post-content.svelte';
  import { scrollTo } from '$lib/navigation';

  const { data } = $props();

  $effect(() => page?.url && scrollTo(page.url));
</script>

<svelte:head>
  <meta name="robots" content="index, nofollow" />
  <meta
    property="article:published_time"
    content={new Date(data.post.date || '0')?.toISOString()} />
  <meta
    property="article:modified_time"
    content={new Date(data.post.date || '0')?.toISOString()} />
</svelte:head>

<PostContent post={data.post} fetch={data.fetch} />
