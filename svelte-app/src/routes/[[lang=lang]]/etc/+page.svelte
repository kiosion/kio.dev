<script lang="ts">
  import { t } from '$lib/i18n.js';
  import { pageTitle } from '$lib/navigation';

  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: description = $t('pages.etc.description');
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

{#if data.config?.meta}
  {#each data.config.meta as metaSection, idx}
    <HeadedBlock heading={metaSection.title}>
      <PortableText text={metaSection.content} />
    </HeadedBlock>
    {#if idx < data.config.meta.length - 1}
      <Divider />
    {/if}
  {/each}
{:else}
  <EmptyContent />
  <Divider />
{/if}
