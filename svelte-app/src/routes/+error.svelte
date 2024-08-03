<script lang="ts">
  import { blur, slide } from 'svelte/transition';

  import { page } from '$app/stores';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import Link from '$components/link.svelte';

  import type { LocaleKey } from '$generated';

  let message: LocaleKey = 'errors.generic.message',
    title: LocaleKey = 'errors.generic.title',
    showStack = false,
    status = $page.status;

  switch (status) {
    case 400:
      title = 'errors.bad-request.title';
      message = 'errors.bad-request.message';
      break;
    case 401:
      title = 'errors.unauthorized.title';
      message = 'errors.unauthorized.message';
      break;
    case 404:
      title = 'errors.not-found.title';
      message = 'errors.not-found.message';
      break;
    case 403:
      title = 'errors.forbidden.title';
      message = 'errors.forbidden.message';
      break;
    case 500:
      title = 'errors.internal.title';
      break;
  }

  const parseCausesToFlatList = (
    maybeNestedCause:
      | NonNullable<NonNullable<(typeof $page)['error']>['cause']>
      | NonNullable<NonNullable<(typeof $page)['error']>['cause']>[number]
      | undefined,
    d: number
  ): string[] => {
    if (!maybeNestedCause) {
      return d > 0 ? [] : [stack || 'Unknown error'];
    }

    if (Array.isArray(maybeNestedCause)) {
      return maybeNestedCause
        .map((cause) => parseCausesToFlatList(cause, d + 1))
        .flat()
        .filter(Boolean);
    }

    if (typeof maybeNestedCause === 'object') {
      if ('cause' in maybeNestedCause) {
        return parseCausesToFlatList(
          (maybeNestedCause as Record<string, string>).cause,
          d + 1
        );
      }
      if ('message' in maybeNestedCause) {
        if ('detail' in maybeNestedCause && typeof maybeNestedCause.detail === 'object') {
          return [`${maybeNestedCause.message}: ${maybeNestedCause.detail.message}`];
        }

        return [`${maybeNestedCause.message}`];
      }
    }

    return [maybeNestedCause?.toString?.()];
  };

  $: stack = $page.error?.stack?.trimStart();
  $: causes = parseCausesToFlatList($page.error?.cause, 0);
  $: heading = `${status}: ${$t(title)}`;
</script>

<svelte:head>
  <title>kio.dev | {status}</title>
  <meta name="robots" content="none" />
</svelte:head>

<div class="flex flex-col gap-5" data-test-id="error-page">
  <div class="rounded-xl bg-neutral-100 transition-colors dark:bg-neutral-600">
    <HeadedBlock {heading} first>
      <p class="my-4 text-base">
        <!-- eslint-disable-next-line svelte/prefer-destructured-store-props -->
        {$page.error?.message && $page.status !== 404 ? $page.error.message : $t(message)}
      </p>
      <p class="my-4 text-base">
        {$t('Please')}
        <Link on:click={() => window.history.back()}>{$t('go back')}</Link>, or <Link
          on:click={() => window.location.reload()}>{$t('refresh the page')}</Link
        >.
      </p>
    </HeadedBlock>
  </div>

  {#if causes?.length}
    <div class="rounded-xl bg-neutral-100 p-2 transition-colors dark:bg-neutral-600">
      <ArrowButton
        dir={showStack ? 'up' : 'down'}
        text={$t('See more')}
        on:click={() => (showStack = !showStack)}
      />
    </div>
    {#if showStack}
      <div
        class="rounded-xl bg-neutral-100 p-2 transition-colors dark:bg-neutral-600"
        transition:blur={{ duration: BASE_ANIMATION_DURATION, amount: 6 }}
      >
        <pre
          class="font-code whitespace-pre-wrap break-all rounded-lg bg-neutral-0/75 p-4 text-sm transition-colors dark:bg-neutral-700">{#each causes as cause, i}{cause?.trim?.()}{#if i < causes.length - 1}<br
              />{/if}{/each}</pre>
      </div>
    {/if}
  {/if}
</div>
