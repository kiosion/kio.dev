<script lang="ts">
  import { page } from '$app/stores';
  import ContentWrapper from '$components/content-wrapper.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import IconHeader from '$components/headings/icon-header.svelte';
  import Divider from '$components/divider.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    navOptions.set({ down: '', up: '/' });
    pageHeading.set(`Error${$page.status ? ` | ${$page.status}` : ''}`);
  });

  let message = 'Oops, something went wrong';
  let title = 'Error';

  switch ($page.status) {
    case 404:
      title = 'Not Found';
      message = "Sorry, that resource doesn't seem to exist";
      break;
    case 403:
      title = 'Forbidden';
      message = "Oops, you don't have permission to access that";
      break;
    case 500:
      title = 'Internal Server Error';
      message = 'Oops, something went wrong';
      break;
  }
</script>

<svelte:head>
  <title>kio.dev | {$page.status}</title>
</svelte:head>

<div data-test-route="error" class="mt-12">
  <ContentWrapper>
    <h3 class="font-display font-bold text-3xl text-center mb-4">{title}</h3>
    <div class="mx-12">
      <Divider />
    </div>
    <IconHeader icon="Downasaur" text={message} classes="mx-auto w-fit" />
  </ContentWrapper>
</div>
