<script lang="ts">
  import ListItem from '$components/lists/blog-item.svelte';
  import { onMount } from 'svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import type { PageData } from './$types';
  import { setupNavigation } from '$helpers/navigation';
  import { page } from '$app/stores';
  import Hoverable from '$components/hoverable.svelte';
  import { RECENT_POSTS_COUNT } from '$lib/consts';
  import { t } from '$lib/helpers/i18n';
  import SFX from '$lib/sfx';
  import type { PostDocument } from '$types';
  import ListSection from '$components/lists/blog-section.svelte';
  import EmptyContent from '$components/empty-content.svelte';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });

  export let data: PageData;

  let postsExceptPinned: PostDocument[] = [];

  const pageTitle = `kio.dev | ${t('Blog').toLowerCase()}`,
    description = t('Thoughts about tech, design, and development');

  $: ({ pinned, posts } = data);
  $: posts?.data &&
    (postsExceptPinned = posts?.data?.filter(
      (post) => post._id !== pinned?.data?._id
    ));
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content="blog, posts, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page?.url?.href} />
  <meta property="og:title" content="kio.dev | blog" />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page?.url?.href} />
  <meta property="twitter:title" content="kio.dev | blog" />
  <meta property="twitter:description" content={description} />
</svelte:head>

{#if pinned?.data}
  <IconHeader icon="Pin" text={t('Pinned')} />
  <ListItem post={pinned.data} />
{/if}
<!-- <IconHeader icon="Clock" text={t('Recent')} /> -->
<IconHeader icon="bulletlist" text={t('Recent posts')} />
{#if posts?.data?.length}
  <div class="flex flex-col">
    <ListSection posts={postsExceptPinned} />
  </div>
{:else}
  <div class="flex w-full flex-row items-center justify-center">
    <EmptyContent />
  </div>
{/if}
{#if posts?.meta?.total > RECENT_POSTS_COUNT}
  <Hoverable>
    <a
      href="/blog/1"
      class="mt-8 block w-fit"
      aria-label={t('View more posts')}
      on:click={() => SFX.click.play()}
    >
      <IconHeader icon="ArrowRight" text={t('View more')} classes="" />
    </a>
  </Hoverable>
{/if}
