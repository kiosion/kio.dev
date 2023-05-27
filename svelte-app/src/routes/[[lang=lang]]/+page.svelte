<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import { t } from '$i18n';
  import { pageHeading } from '$stores/navigation';

  import Divider from '$components/divider.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { PageData } from './$types';
  import type { Unsubscriber } from 'svelte/store';

  let subscribers = [] as Unsubscriber[];

  onMount(() => {
    setupNavigation($page?.url?.pathname);

    subscribers = [
      t.subscribe((_) => {
        pageHeading.set(`kio.dev | ${$t('Index')}`);
      })
    ];
  });

  onDestroy(() => {
    subscribers.forEach((unsub) => unsub());
  });

  export let data: PageData;

  $: about = data.about?.data;
  $: pageTitle = `kio.dev | ${$t('Index')}`;
  $: description = $t('A bit about me, my work, and what I do');
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
  {#if about}
    <HeadedBlock icon="User" heading={$t('About me')}>
      <PortableText text={about.bio} />
    </HeadedBlock>
    {#if about.bio && about.now}
      <Divider />
    {/if}
    {#if about.now}
      <HeadedBlock icon="Clock" heading={$t("What I'm up to now")}>
        <PortableText text={about.now} />
      </HeadedBlock>
    {/if}
  {:else}
    <EmptyContent />
  {/if}
</ContentWrapper>
