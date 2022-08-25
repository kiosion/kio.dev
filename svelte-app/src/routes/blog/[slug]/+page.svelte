<script lang="ts">
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import { onMount } from 'svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import { post } from '@/stores/posts';
  import { parseEmoji } from '$lib/helpers/emoji';
  import { navOptions, pageHeading } from '@/stores/menu';
  import PostFooter from '@/components/blog/post-footer.svelte';
  import PostHeader from '@/components/blog/post-header.svelte';

  let body: HTMLElement;

  // TODO: Make reactive - Previous page should set this
  // either via context API or stores.
  navOptions.set({ down: '', up: '/blog' });

  const pageTitle = $post?.data
    ? `Blog | ${$post.data.title.slice(0, 50)}`
    : 'Blog';
  pageHeading.set(pageTitle);

  onMount(() => {
    parseEmoji(body);
  });
</script>

<svelte:head>
  <title
    >kio.dev | blog{$post?.data?.title ? ` | ${$post.data.title}` : ''}</title
  >
</svelte:head>

<div data-test-route="post">
  {#if $post?.data}
    <ContentWrapper>
      <PostHeader post={$post.data} />
      <div class="mt-4 font-sans text-base" bind:this={body}>
        <PortableText text={$post.data.body} />
      </div>
      <PostFooter tags={$post.data.tags} />
    </ContentWrapper>
  {/if}
</div>
