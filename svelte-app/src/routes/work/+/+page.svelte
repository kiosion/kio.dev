<script lang="ts">
  import { navOptions, pageHeading } from '$stores/navigation';
  import PageHeading from '$components/headings/page-heading.svelte';

  pageHeading.set('Work | Tags');
  navOptions.set({ down: '', up: '/work' });
</script>

<svelte:head>
  <title>kio.dev | work | tags</title>
</svelte:head>

<div data-test-route="tags" class="w-full">
  <PageHeading heading="Tags" text="All project tags" />
  <div class="mb-12" />
</div>
