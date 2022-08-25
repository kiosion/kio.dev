<script lang="ts">
  import PageHeading from '@/components/headings/page-heading.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import { about } from '@/stores/about';
  import { navOptions, pageHeading } from '@/stores/menu';

  navOptions.set({ down: '', up: '/work' });
  pageHeading.set('About');
</script>

<svelte:head>
  <title>kio.dev | about</title>
</svelte:head>

<div data-test-route="about" class="w-full h-full">
  <PageHeading title="about" subtitle="A little blurb about me and my work" />
  <ContentWrapper>
    {#if $about?.data?.body}
      <div>
        <PortableText text={$about.data.body} />
      </div>
    {:else}
      <p>Error loading about</p>
    {/if}
  </ContentWrapper>
</div>
