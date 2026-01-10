<script lang="ts">
  import BlogContent from '$components/pages/blog-content.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <meta name="robots" content="index, follow" />
</svelte:head>

<BlogContent posts={data.posts} tags={data.tags} />
