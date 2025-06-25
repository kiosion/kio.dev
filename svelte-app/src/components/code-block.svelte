<script lang="ts">
  import { onMount } from 'svelte';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';

  import Divider from '$components/divider.svelte';
  import ClipboardDocument from '$components/icons/clipboard-document.svelte';
  import ClipboardDocumentCheck from '$components/icons/clipboard-document-check.svelte';
  import DocumentTextSmall from '$components/icons/document-text-small.svelte';
  import MinusCircleSmall from '$components/icons/minus-circle-small.svelte';
  import MinusSmall from '$components/icons/minus-small.svelte';
  import PlusCircleSmall from '$components/icons/plus-circle-small.svelte';
  import PlusSmall from '$components/icons/plus-small.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  import HighlightSvelte from 'svelte-highlight/HighlightSvelte.svelte';
  import LineNumbers from 'svelte-highlight/LineNumbers.svelte';
  import Highlight from 'svelte-highlight/Highlight.svelte';

  import type { LanguageType as SHLanguageType } from 'svelte-highlight/languages';
  import type * as SHLanguages from 'svelte-highlight/languages';

  type SHLanguageUnion = Extract<keyof typeof SHLanguages, string>;

  export let content: string,
    filename: string | undefined,
    showLineNumbers = true,
    lang: string | undefined;

  const DEFAULT_CODE_BLOCK_HEIGHT = 52 * 7;

  let LanguageType: Promise<SHLanguageType<string>>,
    codeContainer: HTMLElement,
    showMoreHeight: number | undefined,
    innerHeight: number,
    hideLoader = false,
    copied: ReturnType<typeof setTimeout> | undefined,
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

  const getLangType = async (lang?: string): Promise<SHLanguageType<SHLanguageUnion>> => {
    try {
      // Handle some cases where the name isn't the import name
      switch (lang) {
        case 'c#':
          return (await import('svelte-highlight/languages/csharp')).csharp;
        case 'c++':
          return (await import('svelte-highlight/languages/cpp')).cpp;
        case 'html':
          return (await import('svelte-highlight/languages/xml')).xml;
        case 'sh':
        case 'shell':
          return (await import('svelte-highlight/languages/bash')).bash;
        case 'svelte':
        case undefined:
          return (await import('svelte-highlight/languages/markdown')).markdown;
        default:
          return (await import(`../../node_modules/svelte-highlight/languages/${lang}.js`))[lang];
      }
    } catch {
      return (await import('svelte-highlight/languages/markdown')).markdown;
    }
  };

  onMount(() => {
    LanguageType = getLangType(lang?.toLowerCase());
  });

  const updateHeight = (height?: number) => height && (containerHeight = height);

  $: hideLoader = innerHeight > 52;
  $: hideLoader &&
    (innerHeight < DEFAULT_CODE_BLOCK_HEIGHT || showingMore) &&
    updateHeight(showingMore ? innerHeight + (showMoreHeight ?? 0) / 2 : innerHeight);
</script>

<div
  class="mx-7 my-5 rounded-lg bg-neutral-200/50 transition-colors dark:bg-neutral-700"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}
  style="content-visibility: auto"
>
  {#if filename}
    <div
      class="flex flex-row items-center justify-start gap-x-4 bg-neutral-200/50 px-8 py-4 font-mono text-sm transition-colors dark:bg-neutral-800/5"
      id="{id}-filename"
    >
      <DocumentTextSmall class="text-neutral-500 dark:text-neutral-300" />
      <span>{filename}</span>
    </div>
    <Divider margin="my-0"></Divider>
  {/if}

  <Tooltip content={$t('Copy to clipboard')} placement="left">
    <button
      class="focus-outline-sm absolute right-0 z-[2] mr-2.5 mt-2 cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs text-dark/80 transition-colors hover:bg-neutral-300/50 hover:text-dark focus-visible:bg-neutral-300/50 focus-visible:text-dark dark:text-light/80 hover:dark:bg-neutral-500 hover:dark:text-light focus-visible:dark:bg-neutral-500 focus-visible:dark:text-light"
      class:top-1={!filename}
      class:top-14={filename}
      on:click={() => copy()}
      on:keydown={(e) => e.key === 'Enter' && copy()}
      aria-label={copied !== undefined ? $t('Copied') : $t('Copy to clipboard')}
      type="button"
    >
      <svelte:component
        this={copied !== undefined ? ClipboardDocumentCheck : ClipboardDocument}
      />
    </button>
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
      {#await LanguageType then resolvedLang}
        {#if lang === 'svelte'}
          <HighlightSvelte code={content} let:highlighted>
            {#if showLineNumbers === true}
              <LineNumbers {highlighted} hideBorder wrapLines />
            {/if}
          </HighlightSvelte>
        {:else}
          <Highlight code={content} language={resolvedLang} let:highlighted>
            {#if showLineNumbers === true}
              <LineNumbers {highlighted} hideBorder wrapLines />
            {/if}
          </Highlight>
        {/if}
      {:catch error}
        <div class="p-3 font-mono text-sm">
          {$t('Error loading')}:&nbsp;{error.message}
        </div>
      {/await}
    </div>
    <p class="sr-only" aria-label={$t('Code content')}>{content}</p>
  </div>

  {#if hideLoader && innerHeight > DEFAULT_CODE_BLOCK_HEIGHT}
    <div
      class="show-more-gradient absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center pb-4 pt-6 text-center"
      class:showingMore
      bind:clientHeight={showMoreHeight}
    >
      <button
        class="focus-outline group flex w-fit cursor-pointer flex-row items-center justify-center gap-x-1.5 rounded-md bg-neutral-300/50 px-2 py-1.5 text-sm transition-colors hover:bg-neutral-300 focus-visible:bg-neutral-300 dark:bg-neutral-500/50 hover:dark:bg-neutral-500 focus-visible:dark:bg-neutral-500"
        on:click={() => {
          showingMore = !showingMore;
          if (!showingMore) {
            updateHeight(DEFAULT_CODE_BLOCK_HEIGHT);
          }
        }}
        type="button"
      >
        {#if showingMore}
          <MinusSmall class="group-hover:hidden group-focus-visible:hidden" />
          <MinusCircleSmall class="hidden group-hover:block group-focus-visible:block" />
        {:else}
          <PlusSmall class="group-hover:hidden group-focus-visible:hidden" />
          <PlusCircleSmall class="hidden group-hover:block group-focus-visible:block" />
        {/if}
        {$t('Show {amount}', { amount: $t(showingMore ? 'less' : 'more') })}
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  @import '@styles/colors';
  @import '@styles/helpers';
  @import '@styles/mixins';

  .show-more-gradient {
    background: ease-gradient('to top', $neutral-200, transparent);

    @include dark {
      background: ease-gradient('to top', $neutral-700, transparent);
    }
  }
</style>
