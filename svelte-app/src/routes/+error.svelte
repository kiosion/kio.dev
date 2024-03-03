<script lang="ts">
  import { slide } from 'svelte/transition';

  import { page } from '$app/stores';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import Icon from '$components/icon.svelte';
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

<div data-test-id="error-page">
  <HeadedBlock {heading}>
    <p class="my-4 text-base">
      {$page.error?.message && $page.status !== 404 ? $page.error.message : $t(message)}
    </p>
    <p class="my-4 text-base">
      {$t('Please')}
      <Link on:click={() => window.history.back()}>{$t('go back')}</Link>, or <Link
        on:click={() => window.location.reload()}>{$t('refresh the page')}</Link
      >.
    </p>
  </HeadedBlock>

  {#if causes?.length}
    <Divider />
    <ArrowButton align="left" on:click={() => (showStack = !showStack)} fullWidth>
      <span class="flex items-center justify-start gap-2">
        <p class="text-base">{$t('See more')}</p>
        <Icon
          name="ArrowUp"
          size={18}
          inline
          style="transform: {showStack ? 'rotate(0deg)' : 'rotate(180deg)'};"
        />
      </span>
    </ArrowButton>
    {#if showStack}
      <div class="pt-4" transition:slide={{ duration: BASE_ANIMATION_DURATION }}>
        <pre
          class="whitespace-pre-wrap break-all rounded-md border border-dark/40 p-4 font-code text-sm dark:border-light/40">{#each causes as cause, i}{cause?.trim?.()}{#if i < causes.length - 1}<br
              />{/if}{/each}</pre>
      </div>
    {/if}
  {/if}
</div>
