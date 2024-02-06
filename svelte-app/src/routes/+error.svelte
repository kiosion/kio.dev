<script lang="ts">
  import { slide } from 'svelte/transition';

  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import Icon from '$components/icon.svelte';
  import Link from '$components/link.svelte';

  let message = 'Sorry, something went wrong. Please try again.',
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

  $: stack = $page.error?.stack?.trimStart();
  $: causes = $page.error?.cause
    ?.map((cause) => {
      if (typeof cause === 'string') {
        return cause;
      }
      if (cause.message && cause.detail) {
        if (typeof cause.detail === 'object' && cause.detail.message) {
          return `${cause.message}: ${cause.detail.message}`;
        }
        return `${cause.message}: ${cause.detail}`;
      }
      if (cause.message) {
        return cause.message;
      }
      if (cause.detail) {
        if (typeof cause.detail === 'object' && cause.detail.message) {
          return cause.detail.message;
        }
        return cause.detail;
      }
      return undefined;
    })
    ?.filter(Boolean) || [stack || 'Unknown error'];
  $: heading = `${status}: ${$t(title)}`;
</script>

<svelte:head>
  <title>kio.dev | {status}</title>
  <meta name="robots" content="none" />
</svelte:head>

<HeadedBlock {heading} testId="error-page">
  <p>
    {$t($page.error?.message && $page.status !== 404 ? $page.error.message : message)}
  </p>
  <p>
    {$t('Please')}
    <Link on:click={() => window.history.back()}>{$t('go back')}</Link>, or <Link
      on:click={() => window.location.reload()}>{$t('refresh the page')}</Link
    >.
  </p>
</HeadedBlock>

{#if causes?.length}
  <Divider />
  <ArrowButton class="w-full text-left" on:click={() => (showStack = !showStack)}>
    <span class="flex items-center justify-start gap-2">
      <p>{$t('See more')}</p>
      <Icon
        icon="ArrowUp"
        width={18}
        inline
        class={showStack ? 'rotate-0' : 'rotate-180'}
      />
    </span>
  </ArrowButton>
  {#if showStack}
    <div transition:slide={{ duration: BASE_ANIMATION_DURATION }}>
      <pre
        class="mt-4 whitespace-pre-wrap break-all rounded-md border border-dark/40 p-4 font-code text-sm dark:border-light/40">{#each causes as cause}{cause}
        {/each}
</pre>
    </div>
  {/if}
{/if}

<style lang="scss">
  p {
    @apply my-4 text-base;

    span & {
      @apply my-0;
    }
  }
</style>
