<script lang="ts">
  import { onMount } from 'svelte';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';

  import { genericAsyncImport, getLangType } from '$components/code-block/imports';
  import Divider from '$components/divider.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import ClipboardDocument from '$components/icons/clipboard-document.svelte';
  import ClipboardDocumentCheck from '$components/icons/clipboard-document-check.svelte';
  import DocumentTextSmall from '$components/icons/document-text-small.svelte';
  import MinusCircleSmall from '$components/icons/minus-circle-small.svelte';
  import MinusSmall from '$components/icons/minus-small.svelte';
  import PlusCircleSmall from '$components/icons/plus-circle-small.svelte';
  import PlusSmall from '$components/icons/plus-small.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  import type { ResolvedComponentType } from '$components/code-block/imports';
  import type { LanguageType as _LanguageType } from 'svelte-highlight/languages';

  export let content: string,
    filename: string | undefined,
    showLineNumbers = true,
    lang: string | undefined;

  const DEFAULT_CODE_BLOCK_HEIGHT = 52 * 7;

  let LanguageType: Promise<_LanguageType<string>>,
    HighlightSvelte: Promise<ResolvedComponentType<'HighlightSvelte'> | undefined>,
    LineNumbers: Promise<ResolvedComponentType<'LineNumbers'> | undefined>,
    Highlight: Promise<ResolvedComponentType<'Highlight'> | undefined>,
    codeContainer: HTMLElement,
    showMoreHeight: number | undefined,
    innerHeight: number,
    hideLoader = false,
    copied: ReturnType<typeof setTimeout> | undefined,
    loadError: Error | null = null,
    containerHeight = DEFAULT_CODE_BLOCK_HEIGHT,
    showingMore = false;

  const id = Math.random().toString(36).substring(2),
    copy = () => {
      content && navigator.clipboard.writeText(content);

      if (copied === undefined) {
        copied = setTimeout(
          () => {
            copied = undefined;
          },
          (BASE_ANIMATION_DURATION / 2) * 10
        );
      }
    };

  onMount(() => {
    lang = lang?.toLowerCase();

    LineNumbers = showLineNumbers
      ? genericAsyncImport('LineNumbers').then((res) =>
          res instanceof Error ? ((loadError = res), undefined) : res
        )
      : Promise.resolve(undefined);
    HighlightSvelte =
      lang === 'svelte'
        ? genericAsyncImport('HighlightSvelte').then((res) =>
            res instanceof Error ? ((loadError = res), undefined) : res
          )
        : Promise.resolve(undefined);
    Highlight = genericAsyncImport('Highlight').then((res) =>
      res instanceof Error ? ((loadError = res), undefined) : res
    );

    LanguageType = getLangType(lang);
  });

  const updateHeight = (height?: number) => height && (containerHeight = height);

  $: hideLoader = loadError !== null || innerHeight > 52;
  $: hideLoader &&
    (innerHeight < DEFAULT_CODE_BLOCK_HEIGHT || showingMore) &&
    updateHeight(showingMore ? innerHeight + (showMoreHeight ?? 0) / 2 : innerHeight);
</script>

<div
  class="relative mx-7 my-5 overflow-hidden rounded-lg bg-neutral-0 transition-colors dark:bg-neutral-800"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}
>
  {#if filename}
    <div
      class="flex flex-row items-center justify-start gap-x-4 bg-neutral-0 px-8 py-4 font-mono text-sm transition-colors dark:bg-neutral-800/5"
      id="{id}-filename"
    >
      <DocumentTextSmall class="text-neutral-500 dark:text-neutral-300" />
      <span>{filename}</span>
    </div>
    <Divider margin="my-0"></Divider>
  {/if}

  <Tooltip text={$t('Copy to clipboard')} position="top">
    <Hoverable let:hovered>
      <button
        class="focus-outline-sm absolute right-0 z-[2] mr-2.5 mt-2 cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs text-dark/80 transition-colors dark:text-light/80"
        class:top-1={!filename}
        class:top-14={filename}
        class:bg-neutral-100={hovered}
        class:text-dark={hovered}
        class:dark:bg-neutral-500={hovered}
        class:dark:text-light={hovered}
        on:click={() => copy()}
        on:keydown={(e) => e.key === 'Enter' && copy()}
        aria-label={copied !== undefined ? $t('Copied') : $t('Copy to clipboard')}
        type="button"
      >
        <svelte:component
          this={copied !== undefined ? ClipboardDocumentCheck : ClipboardDocument}
        />
      </button>
    </Hoverable>
  </Tooltip>
  <div
    class="focus-outline relative h-fit w-full overflow-hidden rounded-sm text-lg transition-[height,color]"
    style="height: {containerHeight}px"
    bind:this={codeContainer}
  >
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transition-opacity"
      class:opacity-0={hideLoader}
      aria-hidden="true"
    >
      <Spinner />
    </div>
    <div
      class="h-fit w-full min-w-full rounded-sm p-1 pl-4 pr-8 transition-all"
      id="hljs-container"
      aria-hidden="true"
      bind:clientHeight={innerHeight}
    >
      {#if !loadError}
        <!-- eslint-disable-next-line prettier/prettier -->
        {#await Promise.all([HighlightSvelte, Highlight, LanguageType, LineNumbers]) then [resolvedHighlightSvelte, resolvedHighlight, resolvedLang, resolvedLineNumbers]}
          <svelte:component
            this={lang === 'svelte' ? resolvedHighlightSvelte : resolvedHighlight}
            code={content}
            language={resolvedLang}
            let:highlighted
          >
            {#if showLineNumbers === true}
              <svelte:component
                this={resolvedLineNumbers}
                {highlighted}
                hideBorder
                wrapLines
              />
            {/if}
          </svelte:component>
        {:catch error}
          <div class="p-3 font-mono text-sm">Error loading: {error.message}</div>
        {/await}
      {:else}
        <div class="p-3 font-mono text-sm">Error loading: {loadError.message}</div>
      {/if}
    </div>
    <p class="sr-only" aria-label={$t('Code content')}>{content}</p>
  </div>

  {#if hideLoader && innerHeight > DEFAULT_CODE_BLOCK_HEIGHT}
    <div
      class="show-more-gradient absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center pb-4 pt-6 text-center"
      bind:clientHeight={showMoreHeight}
    >
      <Hoverable let:hovered>
        <button
          class="focus-outline flex w-fit flex-row items-center justify-center gap-x-1.5 rounded-md bg-neutral-100/50 px-2 py-1.5 text-sm transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 dark:bg-neutral-500/50 hover:dark:bg-neutral-500 focus-visible:dark:bg-neutral-500"
          on:click={() => {
            showingMore = !showingMore;
            if (!showingMore) {
              updateHeight(DEFAULT_CODE_BLOCK_HEIGHT);
            }
          }}
          type="button"
        >
          <svelte:component
            this={showingMore
              ? hovered
                ? MinusCircleSmall
                : MinusSmall
              : hovered
                ? PlusCircleSmall
                : PlusSmall}
          />
          {$t('Show {amount}', { amount: $t(showingMore ? 'less' : 'more') })}
        </button>
      </Hoverable>
    </div>
  {/if}
</div>

<style lang="scss">
  @import '@styles/colors';
  @import '@styles/helpers';
  @import '@styles/mixins';

  .show-more-gradient {
    background: ease-gradient('to top', $neutral-0, transparent);

    @include dark {
      background: ease-gradient('to top', $neutral-800, transparent);
    }
  }
</style>
