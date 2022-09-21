<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import { post } from '$stores/blog';
  import { navOptions, pageHeading } from '$stores/navigation';
  import PostContent from '@/components/blog/post-content.svelte';
  import { onMount } from 'svelte';
  import { Boundary } from '$lib/error-bound';

  const pageTitle = $post?.data
    ? `Blog | ${$post.data.title.slice(0, 50)}`
    : 'Blog';

  onMount(() => {
    pageHeading.set(pageTitle);
    navOptions.set({ down: '', up: '/blog' });
  });
</script>

<svelte:head>
  <title>
    kio.dev | blog {$post.data?.title ? `| ${$post.data.title}` : ''}
  </title>
</svelte:head>

<div data-test-route="post">
  {#if $post?.data}
    <ContentWrapper>
      <Boundary onError={console.error}>
        <PostContent post={$post.data} />
      </Boundary>
    </ContentWrapper>
  {/if}
</div>
