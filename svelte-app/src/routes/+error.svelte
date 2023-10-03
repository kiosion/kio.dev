<script lang="ts">
  import { slide } from 'svelte/transition';

  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import Link from '$components/link.svelte';

  let message = 'Sorry, something went wrong. Please try again later',
    title = 'Unknown Error',
    showStack = false,
    status = $page.status;

  switch (status) {
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

  $: stack = ($page.error as Error & { stack?: string })?.stack?.trimStart();
</script>

<svelte:head>
  <title>kio.dev | {status}</title>
</svelte:head>

<div class="mt-12">
  <ContentWrapper>
    <h3 class="mb-5 font-code text-3xl font-bold">
      {status}: {$t(title)}
    </h3>
    <p class="inline-block text-base">
      {$t($page.error?.message && $page.status !== 404 ? $page.error.message : message)}
      {$t('Click here to')}
      <Link
        aria-label={$t('Go back')}
        on:click={() => {
          window.history.back();
        }}
        on:keydown={() => {
          window.history.back();
        }}>{$t('go back')}</Link
      >.
    </p>
    {#if stack}
      <Divider />
      <ArrowButton class="w-full text-left" on:click={() => (showStack = !showStack)}>
        {showStack ? $t('Hide stack trace') : $t('Show stack trace')}
        <span class="inline-block {showStack ? 'rotate-90' : '-rotate-90'}">&larr;</span>
      </ArrowButton>
      {#if showStack}
        <div transition:slide={{ duration: BASE_ANIMATION_DURATION }}>
          <pre
            class="mt-4 whitespace-pre-wrap break-all rounded-md border border-dark/40 p-4 font-code text-sm dark:border-light/40">
              {stack}
            </pre>
        </div>
      {/if}
    {/if}
  </ContentWrapper>
</div>
