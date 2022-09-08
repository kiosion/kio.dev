<script lang="ts">
  import { navOptions, pageHeading } from '$stores/nav';
  import PageHeading from '$components/headings/page-heading.svelte';

  pageHeading.set('Blog | Tags');
  navOptions.set({ down: '', up: '/blog' });
</script>

<svelte:head>
  <title>kio.dev | blog | tags</title>
</svelte:head>

<div data-test-route="tags" class="w-full">
  <PageHeading heading="Tags" text="All blog tags" />
  <div class="mb-12" />
</div>
