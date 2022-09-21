<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import { about } from '$stores/about';
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import { onMount } from 'svelte';
  import AboutCard from '$components/about/card.svelte';
  import AboutTimeline from '$components/about/timeline.svelte';
  import AboutSection from '$components/about/section.svelte';
  import { Boundary } from '$lib/error-bound';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });
</script>

<svelte:head>
  <title>kio.dev | about</title>
  <meta name="description" content="A bit about me & my work" />
  <meta name="keywords" content="About, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kio.dev/about" />
  <meta property="og:title" content="kio.dev | about" />
  <meta property="og:description" content="A bit about me & my work" />
  <meta property="twitter:url" content="https://kio.dev/about" />
  <meta property="twitter:title" content="kio.dev | about" />
  <meta property="twitter:description" content="A bit about me & my work" />
</svelte:head>

<div data-test-route="about">
  <ContentWrapper>
    <Boundary onError={console.error}>
      <AboutCard image={$about?.data?.image} body={$about?.data?.bio} />
    </Boundary>
    {#if $about?.data?.timeline}
      <Boundary onError={console.error}>
        <AboutSection title="My work" icon="Briefcase">
          <AboutTimeline data={$about.data.timeline} />
        </AboutSection>
      </Boundary>
    {/if}
    {#if $about?.data?.body}
      <Boundary onError={console.error}>
        <AboutSection title="More" icon="InfoBox">
          <div class="mx-1 font-sans">
            <PortableText text={$about.data.body} />
          </div>
        </AboutSection>
      </Boundary>
    {/if}
  </ContentWrapper>
</div>
