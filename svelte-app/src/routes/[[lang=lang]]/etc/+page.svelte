<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { t } from '$i18n';

  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import Link from '$components/link.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: pageTitle = `kio.dev | ${$t('Meta + Contact')}`;
  $: description = $t('A peek into my current adventures in tech and beyond');
  $: browser && !data.about && invalidate($page.url.pathname);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta itemprop="name" content={pageTitle} />
  <meta itemprop="description" content={description} />
  <meta name="description" content={description} />
  <meta name="keywords" content="About, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<ContentWrapper>
  {#if data.about}
    <HeadedBlock icon="Message" heading={$t('Say hello')}>
      <PortableText text={data.about.contact} />
    </HeadedBlock>

    <Divider />

    <HeadedBlock icon="LockOpen" heading={$t('PGP')}>
      <p>
        {$t("Want to send a secure message my way? Here's my main PGP key:")}
        <Link href="/pgp.txt" newtab
          >D1FD DE24 BB72 BFEF E045 ECE0 8A2C 67E2 2184 F162</Link
        >
      </p>
    </HeadedBlock>

    <Divider />

    <HeadedBlock icon="InfoBox" heading={$t('Meta')}>
      <PortableText text={data.about.body} />
    </HeadedBlock>
  {:else}
    <EmptyContent />
  {/if}
</ContentWrapper>

<style lang="scss">
  p {
    @apply my-4;
  }
</style>
