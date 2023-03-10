<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { onMount, onDestroy } from 'svelte';
  import { setupNavigation } from '$helpers/navigation';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import type { PageData } from './$types';
  import LinkNonPt from '$components/link-non-pt.svelte';
  import Divider from '$components/divider.svelte';
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

  $: about = data?.about?.data;
  $: pageTitle = `kio.dev | ${$t('Meta + Contact').toLowerCase()}`;
  $: description = $t('A peek into my current adventures in tech and beyond');
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

<div data-test-route="meta">
  <ContentWrapper fixed>
    {#if about}
      <IconHeader icon="Message" text={$t('Say hello')} />
      <div>
        <PortableText text={about.contact} />
      </div>

      <Divider />

      <IconHeader icon="LockOpen" text={$t('PGP')} />
      <div>
        <p>
          {$t("Want to send a secure message my way? Here's my main PGP key:")}
          <LinkNonPt href="/pgp.txt" target="_blank"
            >D1FD DE24 BB72 BFEF E045 ECE0 8A2C 67E2 2184 F162</LinkNonPt
          >
        </p>
      </div>

      <Divider />

      <IconHeader icon="InfoBox" text={$t('Meta')} />
      <div>
        <PortableText text={about.body} />
      </div>
    {:else}
      <EmptyContent />
    {/if}
  </ContentWrapper>
</div>

<style lang="scss">
  div {
    div {
      @apply mx-1 font-sans text-base text-stone-700;

      p {
        @apply my-4;
      }
    }
  }

  :global(.dark) {
    div {
      div {
        @apply text-stone-200;
      }
    }
  }
</style>
