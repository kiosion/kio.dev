<script lang="ts">
  import { blur } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { linkTo, t } from '$lib/i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import MinusCircleSmall from '$components/icons/minus-circle-small.svelte';
  import MinusSmall from '$components/icons/minus-small.svelte';
  import PlusCircleSmall from '$components/icons/plus-circle-small.svelte';
  import PlusSmall from '$components/icons/plus-small.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';

  import type { LocaleKey } from '$types/generated';

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
  <!-- eslint-disable-next-line -->
  <title>kio.dev | {status}</title>
  <meta name="robots" content="none" />
</svelte:head>

<div class="flex flex-col gap-5" data-test-id="error-page">
  <BaseContainer class="flex flex-row items-center justify-end gap-3 p-2">
    <ArrowButton
      dir="left"
      text={$t('Go back')}
      on:click={() =>
        window.history.length > 2 ? window.history.back() : goto($linkTo('/'))}
    />
    <button
      class="focus-outline group flex w-fit cursor-pointer flex-row items-center justify-center gap-x-2 rounded-lg bg-neutral-200/50 px-2.5 py-2 text-sm transition-colors hover:bg-neutral-200 focus-visible:gap-3 focus-visible:bg-neutral-200 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
      on:click={() => window.location.reload()}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="size-4 group-hover:hidden group-focus-visible:hidden"
      >
        <path
          fill-rule="evenodd"
          d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="hidden size-4 group-hover:block group-focus-visible:block"
      >
        <path
          fill-rule="evenodd"
          d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 1 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z"
          clip-rule="evenodd"
        />
      </svg>
      {$t('Reload page')}
    </button>
  </BaseContainer>

  <BaseContainer class="p-5">
    <h1
      class="mb-4 px-1 font-display text-3xl font-black text-neutral-900 dark:text-neutral-100"
    >
      {heading}
    </h1>
    <p class="px-1 text-md">
      <!-- eslint-disable-next-line svelte/prefer-destructured-store-props -->
      {$page.error?.message && $page.status !== 404 ? $page.error.message : $t(message)}
    </p>
    {#if causes?.length}
      <button
        class="focus-outline group mt-8 flex w-fit cursor-pointer flex-row items-center justify-center gap-x-1.5 rounded-lg bg-neutral-200/50 px-2.5 py-2 text-sm transition-colors hover:bg-neutral-200 focus-visible:gap-3 focus-visible:bg-neutral-200 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
        on:click={() => (showStack = !showStack)}
        type="button"
      >
        {#if showStack}
          <MinusSmall class="group-hover:hidden group-focus-visible:hidden" />
          <MinusCircleSmall class="hidden group-hover:block group-focus-visible:block" />
        {:else}
          <PlusSmall class="group-hover:hidden group-focus-visible:hidden" />
          <PlusCircleSmall class="hidden group-hover:block group-focus-visible:block" />
        {/if}
        {$t('Show {amount}', { amount: $t(showStack ? 'less' : 'more') })}
      </button>
    {/if}
  </BaseContainer>

  {#if showStack}
    <div
      class="rounded-xl border border-neutral-200/50 bg-neutral-100 p-2 transition-colors dark:border-neutral-500/50 dark:bg-neutral-600"
      transition:blur={{ duration: BASE_ANIMATION_DURATION, amount: 6 }}
    >
      <pre
        class="font-code whitespace-pre-wrap break-all rounded-lg bg-neutral-200/75 p-4 text-sm transition-colors dark:bg-neutral-700">{#each causes as cause, i}{cause?.trim?.()}{#if i < causes.length - 1}<br
            />{/if}{/each}</pre>
    </div>
  {/if}
</div>
