<script lang="ts" context="module">
  import { about, findAbout } from '@/stores/about';
  import Logger from '$lib/logger';

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    await findAbout(fetch)
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        about.set(res);
      })
      .catch((err: unknown) => {
        Logger.error(err as string, 'routes/about');
      });
  };
</script>

<script lang="ts">
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
</script>

<svelte:head>
  <title>kio.dev | about</title>
</svelte:head>

<div data-test-route="about" class="w-full">
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
