<script lang="ts">
  import { t } from '$lib/i18n';
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

<div class="flex flex-col gap-5">
  {#if data.config?.meta}
    {#each data.config.meta as metaSection}
      <div class="rounded-xl bg-neutral-100 transition-colors dark:bg-neutral-600">
        <HeadedBlock heading={metaSection.title} first>
          <PortableText text={metaSection.content} class="-mt-2" bodySize="base" />
        </HeadedBlock>
      </div>
    {/each}
  {:else}
    <EmptyContent />
  {/if}
</div>
