<script lang="ts">
  import { page } from '$app/stores';
  import { sortDocumentsByYear } from '$helpers/date';
  import { t } from '$helpers/i18n';
  import { pageTitle } from '$helpers/navigation';

  import EmptyContent from '$components/empty-content.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import ListItem from '$components/lists/list-item.svelte';

  export let data;

  const sortedPosts = data.posts.length ? sortDocumentsByYear(data.posts) : [];

  $: description = $t('Thoughts about tech, design, and development');
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta itemprop="name" content={$pageTitle} />
  <meta itemprop="description" content={description} />
  <meta name="description" content={description} />
  <meta name="keywords" content="blog, posts, blog posts, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page?.url?.href} />
  <meta property="og:title" content={$pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page?.url?.href} />
  <meta property="twitter:title" content="kio.dev | blog" />
  <meta property="twitter:description" content={description} />
</svelte:head>

<ContentWrapper wide>
  <h1 class="mb-8 mt-10 font-code text-3xl font-black">{$t('Recent posts')}</h1>
  {#if data.posts.length}
    <div class="mt-12 flex flex-col gap-14">
      {#each sortedPosts as yearObj}
        <div class="flex flex-col items-start justify-start gap-y-2 md:flex-row">
          <h1 class="min-w-[6rem] font-code text-4xl font-black">{yearObj.year}</h1>
          {#if yearObj.items.length}
            <div
              class="ml-1 mt-2 flex w-full flex-col items-start justify-start gap-4 md:ml-0"
            >
              {#each yearObj.items as item}
                <ListItem document={item} />
              {/each}
            </div>
          {:else}
            <p class="p-4 font-code">{$t('No content')}</p>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex w-full flex-row items-center justify-center">
      <EmptyContent />
    </div>
  {/if}
</ContentWrapper>
