<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';

  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';

  let message = 'Sorry, something went wrong. Please try again later';
  let title = 'Unknown Error';

  switch ($page.status) {
    case 400:
      title = 'Bad Request';
      message = 'Sorry, that request was invalid or malformed.';
      break;
    case 401:
      title = 'Unauthorized';
      message = "Sorry, you don't have permission to access that resource.";
      break;
    case 404:
      title = 'Not Found';
      message = "Sorry, that resource doesn't seem to exist.";
      break;
    case 403:
      title = 'Forbidden';
      message = "Sorry, you don't have permission to access that resource.";
      break;
    case 500:
      title = 'Internal Error';
      break;
  }
</script>

<svelte:head>
  <title>kio.dev | {$page.status}</title>
</svelte:head>

<div data-test-route="error" class="mt-12">
  <ContentWrapper>
    <h3 class="mb-4 font-code text-3xl font-bold">
      {$t(title)}
    </h3>
    <IconHeader
      icon="Downasaur"
      text={$t(
        $page.error?.message && $page.status !== 404 ? $page.error.message : message
      )}
    />
    {#if $page.error?.stack}
      <Divider />
      <div>
        <h4 class="mb-4 mt-8 w-full font-code text-xl font-bold">Stack Trace</h4>
        <pre
          class="whitespace-pre-wrap rounded-md bg-dark/5 p-2 font-code text-sm dark:bg-light/5">
            {$page.error.stack}
          </pre>
      </div>
    {/if}
  </ContentWrapper>
</div>
