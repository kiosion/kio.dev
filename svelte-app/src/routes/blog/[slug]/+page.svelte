<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import { post } from '$stores/blog';
  import { navOptions, pageHeading } from '$stores/nav';
  import PostContent from '@/components/blog/post-content.svelte';

  const pageTitle = $post?.data
    ? `Blog | ${$post.data.title.slice(0, 50)}`
    : 'Blog';
  pageHeading.set(pageTitle);
  navOptions.set({ down: '', up: '/blog' });
</script>

<svelte:head>
  <title>
    kio.dev | blog {$post.data?.title ? `| ${$post.data.title}` : ''}
  </title>
</svelte:head>

<div data-test-route="post">
  {#if $post?.data}
    <ContentWrapper>
      <PostContent post={$post.data} />
    </ContentWrapper>
  {/if}
</div>
