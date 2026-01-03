<script lang="ts">
  import { page } from '$app/state';
  import { BASE_PAGE_TITLE } from '$lib/consts';

  let title = $state('Unknown Error');
  let message = $state('Sorry, something went wrong. Please try again.');
  let showStack = $state(false);

  switch (page.status) {
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
      message = "Sorry, that resource doesn't exist or can't be found.";
      break;
    case 403:
      title = 'Forbidden';
      message = "Sorry, you don't have permission to access that resource.";
      break;
    case 500:
      title = 'Internal Error';
      break;
  }

  const parseCausesToFlatList = (
    maybeNestedCause:
      | NonNullable<NonNullable<(typeof page)['error']>['cause']>
      | NonNullable<NonNullable<(typeof page)['error']>['cause']>[number]
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

  const stack = $derived(page.error?.stack?.trimStart());
  const causes = $derived(parseCausesToFlatList(page.error?.cause, 0));
  const heading = $derived(`${page.status}: ${title}`);

  page.data.breadcrumbs = [{ label: 'Error' }];
</script>

<svelte:head>
  <meta name="robots" content="none" />
  <title>{heading} | {BASE_PAGE_TITLE}</title>
</svelte:head>

{#snippet textButton(onClick: () => void, label: string)}
  <button
    type="button"
    class="hover:decoration-orange-light hover:dark:decoration-orange-dark w-fit cursor-pointer underline decoration-neutral-200 decoration-2 underline-offset-[3px] transition-colors dark:decoration-neutral-400"
    onclick={onClick}>{label}</button
  >
{/snippet}

<div class="flex h-full min-w-full flex-grow flex-col gap-y-10" data-test-id="error-page">
  <section
    class="mt-10 flex w-full flex-row flex-wrap items-start justify-between gap-y-12"
  >
    <div class="mr-auto flex flex-col gap-8">
      <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
        {heading}
      </h1>
      <p>
        {page.error?.message && page.status !== 404 ? page.error.message : message}
      </p>
      <div class="flex flex-row items-center gap-2 text-base">
        {@render textButton(() => history.back(), 'Go back')}
        <span class="opacity-70 select-none">/</span>
        {#if causes?.length}
          {@render textButton(
            () => (showStack = !showStack),
            showStack ? 'Hide details' : 'Show details'
          )}
        {/if}
      </div>
    </div>
  </section>
  {#if showStack}
    <section class="max-w-5xl overflow-x-auto">
      <pre
        class="font-code rounded-lg bg-neutral-200/75 p-4 text-sm break-all whitespace-pre-wrap transition-colors dark:bg-neutral-700">{#each causes as cause, i}{cause?.trim?.()}{#if i < causes.length - 1}<br
            />{/if}{/each}</pre>
    </section>
  {/if}
</div>
