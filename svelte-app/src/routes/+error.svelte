<script lang="ts">
  import { onMount } from 'svelte';

  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { navOptions, pageHeading } from '$stores/navigation';

  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';

  onMount(() => {
    navOptions.set({ down: '', up: '/' });
    pageHeading.set(`Error${$page.status ? ` | ${$page.status}` : ''}`);
  });

  let message = 'Sorry, something went very wrong';
  let title = 'Unknown Error';

  switch ($page.status) {
    case 400:
      title = 'Bad Request';
      message = 'Sorry, that request was invalid or malformed';
      break;
    case 401:
      title = 'Unauthorized';
      message = "You don't have permission to access that";
      break;
    case 404:
      title = 'Not Found';
      message = "Sorry, that resource doesn't seem to exist";
      break;
    case 403:
      title = 'Forbidden';
      message = "Sorry, you don't have permission to access that";
      break;
    case 500:
      title = 'Internal Server Error';
      message = 'Sorry, something went wrong on my end';
      break;
  }
</script>

<svelte:head>
  <title>kio.dev | {$page.status}</title>
</svelte:head>

<div data-test-route="error" class="mt-12">
  <ContentWrapper>
    <h3 class="mb-4 text-center font-display text-3xl font-bold">
      {$t(title)}
    </h3>
    <div class="mx-12">
      <Divider />
    </div>
    <IconHeader
      icon="Downasaur"
      text={$t(
        $page.error?.message && $page.status !== 404 ? $page.error.message : message
      )}
      class="mx-auto w-fit"
    />
  </ContentWrapper>
</div>
