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
    <div class="mb-6 flex flex-col gap-y-5" role="group" aria-labelledby="{id}-heading">
      {#each data.posts as post}
        <ListItem document={post} small />
      {/each}
    </div>
    <ArrowButton href={$linkTo('/thoughts')} fullWidth preload>
      <span class="flex items-center justify-start gap-2">
        <p class="font-mono text-sm">{$t('See more')}</p>
        <Icon name="ArrowRight" size={18} inline />
      </span>
    </ArrowButton>
  {:else}
    <div class="mb-6 flex flex-col gap-y-5">
      <p class="font-code p-4">{$t('No content')}</p>
    </div>
  {/if}
</HeadedBlock>
