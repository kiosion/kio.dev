<script lang="ts">
  import PageHeading from '@/components/headings/page-heading.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  // import { experiments } from '@/stores/experiments';
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="index" class="w-full">
  <PageHeading title="experiments" subtitle=":)" />
  <div class="mt-2">
    <ContentWrapper>
      <p>Wow! This is a secret page! Cool! Nothing here yet!</p>
    </ContentWrapper>
  </div>
</div>
