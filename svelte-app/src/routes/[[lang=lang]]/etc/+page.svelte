<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import { t } from '$i18n';

  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import LinkNonPt from '$components/link-non-pt.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { PageData } from './$types';
  import type { Unsubscriber } from 'svelte/store';

  let subscribers = [] as Unsubscriber[];

  onMount(() => {
    setupNavigation($page?.url?.pathname);

    subscribers = [
      t.subscribe((fn) => {
        setupNavigation($page?.url?.pathname);
      })
    ];
  });

  onDestroy(() => {
    subscribers.forEach((unsub) => unsub());
  });

  export let data: PageData;

  $: pageTitle = `kio.dev | ${$t('Meta + Contact')}`;
  $: description = $t('A peek into my current adventures in tech and beyond');
  $: browser && !data.about && invalidate($page.url.pathname);
</script>

<svelte:head>
  <title>{pageTitle}</title>
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

<ContentWrapper fixed>
  {#if data.about}
    <HeadedBlock icon="Message" heading={$t('Say hello')}>
      <PortableText text={data.about.contact} />
    </HeadedBlock>

    <Divider />

    <HeadedBlock icon="LockOpen" heading={$t('PGP')}>
      <p>
        {$t("Want to send a secure message my way? Here's my main PGP key:")}
        <LinkNonPt href="/pgp.txt" target="_blank"
          >D1FD DE24 BB72 BFEF E045 ECE0 8A2C 67E2 2184 F162</LinkNonPt
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
