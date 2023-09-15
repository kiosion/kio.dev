<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import { t } from '$lib/helpers/i18n';

  import EmptyContent from '$components/empty-content.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import ListItem from '$components/lists/blog-item.svelte';

  import type { PostDocument } from '$types';
  import type { Unsubscriber } from 'svelte/store';

  let unsubscribers = [] as Unsubscriber[];

  onMount(() => {
    unsubscribers = [
      t.subscribe((_) => {
        setupNavigation($page?.url?.pathname);
      })
    ];
  });

  onDestroy(() => {
    unsubscribers.forEach((unsub) => unsub());
  });

  export let data;

  let postsExceptPinned: PostDocument[] = [];

  $: ({ pinned, posts } = data);
  $: posts && (postsExceptPinned = posts?.filter((post) => post._id !== pinned?._id));
  $: pageTitle = `kio.dev | ${$t('Blog')}`;
  $: description = $t('Thoughts about tech, design, and development');
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

{#if pinned}
  <IconHeader icon="Pin" text={$t('Pinned')} />
  <ListItem post={pinned} />
{/if}

<IconHeader icon="bulletlist" text={$t('Recent')} />
{#if posts?.length}
  <div class="flex flex-col gap-y-4">
    {#each posts as post}
      <ListItem {post} />
    {/each}
  </div>
{:else}
  <div class="flex w-full flex-row items-center justify-center">
    <EmptyContent />
  </div>
{/if}
