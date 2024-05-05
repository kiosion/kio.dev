<script lang="ts">
  import { ENV } from '$lib/env';
  import { linkTo, t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import ListItem from '$components/lists/list-item.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: description = $t('pages.about.description');
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta itemprop="name" content={$pageTitle} />
  <meta itemprop="description" content={description} />
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={$pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:title" content={$pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

{#if data.config?.about}
  {#each data.config.about as aboutSection}
    <HeadedBlock heading={aboutSection.title}>
      <PortableText text={aboutSection.content} class="-mt-2" bodySize="base"
      ></PortableText>
    </HeadedBlock>

    <Divider></Divider>
  {/each}
{:else}
  <EmptyContent></EmptyContent>
  <Divider></Divider>
{/if}

<HeadedBlock heading={$t('Recent thoughts')} let:id>
  {#if data.posts.length}
    <div class="mb-6 flex flex-col gap-y-5" role="group" aria-labelledby="{id}-heading">
      {#each data.posts as post}
        <ListItem document={post} />
      {/each}
    </div>
    <div class="flex flex-row items-center justify-start gap-x-6">
      <ArrowButton
        href={$linkTo('/thoughts')}
        dir="right"
        placement="after"
        text={$t('All posts')}
        preload
      />
      {#if ENV !== 'production'}
        <ArrowButton
          href={$linkTo('/thoughts/+')}
          dir="right"
          placement="after"
          text={$t('Topics')}
          preload
        />
      {/if}
    </div>
  {:else}
    <div class="mb-6 flex flex-col gap-y-5">
      <p class="font-code p-4">{$t('No content')}</p>
    </div>
  {/if}
</HeadedBlock>
