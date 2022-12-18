<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import { onMount, getContext } from 'svelte';
  import AboutCard from '$components/about/card.svelte';
  import AboutTimeline from '$components/about/timeline.svelte';
  import AboutSection from '$components/about/section.svelte';
  import type { PageData } from './$types';
  import { t } from '$i18n';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  const getScrollContainer = getContext(
    'getScrollContainer'
  ) as () => HTMLDivElement | null;

  onMount(() => {
    setupNavigation($page?.url?.pathname);
    setTimeout(
      () => getScrollContainer()?.scrollTo({ top: 0, behavior: 'smooth' }),
      BASE_TRANSITION_DURATION - 50
    );
  });

  export let data: PageData;

  const pageTitle = `kio.dev | ${t('About').toLowerCase()}`,
    description = t('A bit about me & my work');

  $: about = data?.about?.data;
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

<div data-test-route="about">
  <ContentWrapper>
    <AboutCard image={about?.image} body={about?.bio} />
    {#if about?.timeline}
      <AboutSection title={t('My work')} icon="Briefcase">
        <AboutTimeline data={about.timeline} />
      </AboutSection>
    {/if}
    {#if about?.body}
      <AboutSection title={t('More')} icon="InfoBox">
        <div class="mx-1 font-sans">
          <PortableText text={about.body} />
        </div>
      </AboutSection>
    {/if}
  </ContentWrapper>
</div>
