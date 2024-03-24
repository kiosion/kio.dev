<script lang="ts">
  import { linkTo, t } from '$lib/i18n.js';
  import { pageTitle } from '$lib/navigation';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import Icon from '$components/icon.svelte';
  import ListItem from '$components/lists/list-item.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: description = $t('pages.about.description');
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta content={$pageTitle} itemprop="name" />
  <meta content={description} itemprop="description" />
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta content="website" property="og:type" />
  <meta content={$pageTitle} property="og:title" />
  <meta content={description} property="og:description" />
  <meta content={$pageTitle} property="twitter:title" />
  <meta content={description} property="twitter:description" />
</svelte:head>

{#if data.config?.about}
  {#each data.config.about as aboutSection}
    <HeadedBlock heading={aboutSection.title}>
      <PortableText text={aboutSection.content} />
    </HeadedBlock>

    <Divider />
  {/each}
{:else}
  <EmptyContent />
  <Divider />
{/if}

<HeadedBlock heading={$t('Recent thoughts')} let:id>
  {#if data.posts.length}
    <div
      class="mb-6 mt-5 flex flex-col gap-y-5"
      aria-labelledby="{id}-heading"
      role="group"
    >
      {#each data.posts as post}
        <ListItem document={post} small />
      {/each}
    </div>
    <ArrowButton fullWidth href={$linkTo('/thoughts')} preload>
      <span class="flex items-center justify-start gap-2">
        <p>{$t('See more')}</p>
        <Icon name="ArrowRight" inline size={18} />
      </span>
    </ArrowButton>
  {:else}
    <div class="mb-6 mt-5 flex flex-col gap-y-5">
      <p class="p-4 font-code">{$t('No content')}</p>
    </div>
  {/if}
</HeadedBlock>
