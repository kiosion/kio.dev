<script lang="ts">
  import ListItem from '$components/blog/list-item.svelte';
  import { onMount } from 'svelte';
  import ErrorText from '$components/error-text.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type { PageData } from './$types';
  import { setupNavigation } from '$helpers/navigation';
  import { page } from '$app/stores';
  import Hoverable from '$components/hoverable.svelte';
  import { RECENT_POSTS_COUNT } from '$lib/consts';
  import { t } from '$lib/helpers/i18n';
  import SFX from '$lib/sfx';

  onMount(() => {
    setupNavigation($page?.url?.pathname);

    window?.scroll?.({ top: 0, behavior: 'smooth' });
  });

  export let data: PageData;

  $: ({ pinned, posts } = data);
</script>

<svelte:head>
  <title>kio.dev | {t('Blog').toLowerCase()}</title>
  <meta
    name="description"
    content={t('Thoughts about (mostly) tech, design, and development')}
  />
  <meta name="keywords" content="blog, posts, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kio.dev/blog" />
  <meta property="og:title" content="kio.dev | blog" />
  <meta
    property="og:description"
    content={t('Thoughts about (mostly) tech, design, and development')}
  />
  <meta property="twitter:url" content="https://kio.dev/blog" />
  <meta property="twitter:title" content="kio.dev | blog" />
  <meta
    property="twitter:description"
    content={t('Thoughts about (mostly) tech, design, and development')}
  />
</svelte:head>

{#if pinned?.data}
  <IconHeader icon="Pin" text={t('Pinned')} />
  <ListItem post={pinned.data} />
{/if}
<IconHeader icon="Clock" text={t('Recent')} />
{#if posts?.data?.length}
  {#each posts.data as post}
    {#if post._id !== pinned?.data?._id}
      <ListItem {post} />
    {/if}
  {/each}
{:else}
  <div class="w-full flex flex-row items-center justify-center">
    <ErrorText text={t('No data')} classes="w-fit" />
  </div>
{/if}
{#if posts?.meta?.total > RECENT_POSTS_COUNT}
  <Hoverable>
    <a
      href="/blog/1"
      class="block w-fit mt-8"
      aria-label={t('View more posts')}
      on:click={() => SFX.click.play()}
    >
      <IconHeader icon="ArrowRight" text={t('View more')} classes="" />
    </a>
  </Hoverable>
{/if}
