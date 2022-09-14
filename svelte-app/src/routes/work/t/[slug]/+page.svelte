<script lang="ts">
  import { page } from '$app/stores';
  import { navOptions, pageHeading } from '$stores/navigation';
  import PageHeading from '$components/headings/page-heading.svelte';

  const pageTitle = $page.params.slug.toLowerCase().replace(/[-_]/g, ' ');
  pageHeading.set(`Work | Tag | ${pageTitle}`);
  navOptions.set({ down: '', up: '/work/t' });
</script>

<svelte:head>
  <title>
    kio.dev | work | tag | {pageTitle}
  </title>
</svelte:head>

<div data-test-route="tag" class="w-full">
  <PageHeading heading={pageTitle} text="Projects tagged with {pageTitle}" />
  <div class="mb-12" />
</div>
