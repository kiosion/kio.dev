<script lang="ts">
  import { pageTitle } from '$helpers/navigation';
  import { t } from '$i18n';

  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: description = $t('How to get in touch, and some meta info about this site');
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

<!-- <HeadedBlock heading={$t('Say hello')}>
  <PortableText text={data.about.contact} />
</HeadedBlock>

<Divider />

<HeadedBlock heading={$t('PGP')}>
  <p>
    {$t("Want to send a secure message my way? Here's my main PGP key:")}
    <Link href="/pgp.txt" newtab>D1FD DE24 BB72 BFEF E045 ECE0 8A2C 67E2 2184 F162</Link>
  </p>
</HeadedBlock>

<Divider />

<HeadedBlock heading={$t('Meta')}>
  <PortableText text={data.about.body} />
</HeadedBlock> -->

<!-- <style lang="scss">
  p {
    @apply my-4 transition-[color];
  }
</style> -->
