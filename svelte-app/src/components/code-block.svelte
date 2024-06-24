<script lang="ts">
  import { onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';

  import { genericAsyncImport, getLangType } from '$components/code-block/imports';
  import Divider from '$components/divider.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Spinner from '$components/loading/spinner.svelte';

  import type { ResolvedComponentType } from '$components/code-block/imports';
  import type { LanguageType as _LanguageType } from 'svelte-highlight/languages';

  export let content: string,
    filename: string | undefined,
    showLineNumbers = true,
    lang: string | undefined;

  const DEFAULT_CODE_BLOCK_HEIGHT = 52 * 4;

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

  // $: showingMore || hideLoader && updateHeight(showingMore ? innerHeight + (showMoreHeight ?? 0) / 2 : innerHeight),
  //   browser && (hideLoader = loadError !== null || innerHeight > 52);
  $: hideLoader = loadError !== null || innerHeight > 52;
  $: hideLoader &&
    (innerHeight < DEFAULT_CODE_BLOCK_HEIGHT || showingMore) &&
    updateHeight(showingMore ? innerHeight + (showMoreHeight ?? 0) / 2 : innerHeight);
</script>

<div
  class="relative my-7 overflow-hidden border-b border-t border-dark/80 bg-neutral-0 transition-[border-color] dark:border-light/60 dark:bg-neutral-100/5 print:bg-transparent"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}
>
  {#if filename}
    <div
      class="bg-neutral-0 py-4 pl-14 font-mono text-sm transition-[background-color] dark:bg-neutral-800/5 print:bg-transparent"
      id="{id}-filename"
    >
      {filename}
    </div>
    <Divider margin="my-0"></Divider>
  {/if}

  <Hoverable let:hovered>
    <button
      class="focus-outline-sm absolute right-0 z-[2] cursor-pointer rounded-xs pb-3 pl-3 pr-4 pt-4 font-mono text-xs text-dark/80 dark:text-light/80"
      class:top-1={!filename}
      class:top-12={filename}
      on:click={() => copy()}
      on:keydown={(e) => e.key === 'Enter' && copy()}
      aria-label={copied !== undefined ? $t('Copied') : $t('Copy to clipboard')}
      type="button"
    >
      <span
        class="-mx-2 -my-1.5 px-2 py-1.5"
        class:bg-neutral-100={hovered}
        class:text-dark={hovered}
        class:dark:bg-neutral-500={hovered}
        class:dark:text-light={hovered}
      >
        [{$t(copied !== undefined ? 'Copied' : 'Copy').toLowerCase()}]
      </span>
    </button>
  </Hoverable>
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
      class="h-fit w-full min-w-full rounded-sm p-1 pl-4 pr-8 transition-all md:pl-10"
      id="hljs-container"
      aria-hidden="true"
      bind:clientHeight={innerHeight}
    >
      {#if !loadError}
        <!-- eslint-disable-next-line prettier/prettier -->
        {#await Promise.all( [HighlightSvelte, Highlight, LanguageType, LineNumbers] ) then [resolvedHighlightSvelte, resolvedHighlight, resolvedLang, resolvedLineNumbers]}
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
      class="show-more-gradient absolute bottom-0 left-0 right-0 z-10 pb-4 pt-6 text-center"
      bind:clientHeight={showMoreHeight}
    >
      <button
        class="focus-outline rounded-xs px-2 py-1.5 font-mono text-xs hover:bg-neutral-100 focus-visible:bg-neutral-100 hover:dark:bg-neutral-500 focus-visible:dark:bg-neutral-500"
        on:click={() => {
          showingMore = !showingMore;
          if (!showingMore) {
            updateHeight(DEFAULT_CODE_BLOCK_HEIGHT);
          }
        }}
        type="button"
        >{$t('Show {amount}', { amount: $t(showingMore ? 'less' : 'more') })}
        {#if showingMore}
          &uarr;
        {:else}
          &darr;
        {/if}
      </button>
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
      background: ease-gradient('to top', $black, transparent);
    }
  }
</style>
