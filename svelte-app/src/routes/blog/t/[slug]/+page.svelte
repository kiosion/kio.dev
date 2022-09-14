<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import PageHeading from '$components/headings/page-heading.svelte';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[-_]/g, ' ');
  pageHeading.set(`Blog | Tag | ${pageTitle}`);
  navOptions.set({ down: '', up: '/blog/t' });
</script>

<svelte:head>
  <title>
    kio.dev | blog | tag | {pageTitle}
  </title>
</svelte:head>

<div data-test-route="tag" class="w-full">
  <PageHeading heading={pageTitle} text="Posts tagged with {pageTitle}" />
  <div class="mb-12" />
</div>
