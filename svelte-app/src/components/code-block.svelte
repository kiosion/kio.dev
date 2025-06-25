<script lang="ts">
  import { onMount } from 'svelte';

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
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Highlight from 'svelte-highlight/Highlight.svelte';
  import HighlightSvelte from 'svelte-highlight/HighlightSvelte.svelte';
  // eslint-disable-next-line import/no-duplicates
  import type { LanguageType as SHLanguageType } from 'svelte-highlight/languages';
  // eslint-disable-next-line import/no-duplicates
  import type * as SHLanguages from 'svelte-highlight/languages';
  import LineNumbers from 'svelte-highlight/LineNumbers.svelte';

  type SHLanguageUnion = Extract<keyof typeof SHLanguages, string>;

  const DEFAULT_CODE_BLOCK_HEIGHT = 52 * 7;

  const {
    content,
    filename,
    showLineNumbers = true,
    lang
  }: {
    content: string;
    filename?: string;
    showLineNumbers?: boolean;
    lang?: string;
  } = $props();

  let langTypePromise = $state<Promise<SHLanguageType<SHLanguageUnion>> | undefined>(
    undefined
  );
  let codeContainer = $state<HTMLElement | undefined>(undefined);
  let showMoreHeight = $state<number | undefined>(undefined);
  let innerHeight = $state(0);
  let hideLoader = $state(false);
  let copied = $state<ReturnType<typeof setTimeout> | undefined>(undefined);
  let containerHeight = $state(DEFAULT_CODE_BLOCK_HEIGHT);
  let showingMore = $state(false);

  const id = Math.random().toString(36).substring(2),
    copy = () => {
      if (content) {
        navigator.clipboard.writeText(content);
      }

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
          return (
            await import(`../../node_modules/svelte-highlight/languages/${lang}.js`)
          )[lang];
      }
    } catch {
      return (await import('svelte-highlight/languages/markdown')).markdown;
    }
  };

  onMount(() => {
    langTypePromise = getLangType(lang?.toLowerCase());
  });

  const updateHeight = (height?: number) => height && (containerHeight = height);

  $effect(() => {
    if (innerHeight > 52) {
      hideLoader = true;
    }
    if (hideLoader && (innerHeight < DEFAULT_CODE_BLOCK_HEIGHT || showingMore)) {
      updateHeight(showingMore ? innerHeight + (showMoreHeight ?? 0) / 2 : innerHeight);
    }
  });
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
      class="focus-outline-sm text-dark/80 hover:text-dark focus-visible:text-dark dark:text-light/80 hover:dark:text-light focus-visible:dark:text-light absolute right-0 z-[2] mt-2 mr-2.5 cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs transition-colors hover:bg-neutral-300/50 focus-visible:bg-neutral-300/50 hover:dark:bg-neutral-500 focus-visible:dark:bg-neutral-500"
      class:top-1={!filename}
      class:top-14={filename}
      onclick={() => copy()}
      onkeydown={(e) => e.key === 'Enter' && copy()}
      aria-label={copied !== undefined ? $t('Copied') : $t('Copy to clipboard')}
      type="button"
    >
      {#if copied !== undefined}
        <ClipboardDocumentCheck />
      {:else}
        <ClipboardDocument />
      {/if}
    </button>
  </Tooltip>
  <div
    class="focus-outline relative h-fit w-full overflow-hidden rounded-sm text-lg transition-[height,color]"
    style="height: {containerHeight}px"
    bind:this={codeContainer}
  >
    <div
      class="pointer-events-none absolute top-1/2 left-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transition-opacity"
      class:opacity-0={hideLoader}
      aria-hidden="true"
    >
      <Spinner />
    </div>
    <div
      class="h-fit w-full min-w-full rounded-sm p-1 pr-8 pl-4 transition-all"
      id="hljs-container"
      aria-hidden="true"
      bind:clientHeight={innerHeight}
    >
      {#if langTypePromise}
        {#await langTypePromise then resolvedLang}
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
      {/if}
    </div>
    <p class="sr-only" aria-label={$t('Code content')}>{content}</p>
  </div>

  {#if hideLoader && innerHeight > DEFAULT_CODE_BLOCK_HEIGHT}
    <div
      class="show-more-gradient absolute right-0 bottom-0 left-0 z-10 flex items-center justify-center pt-6 pb-4 text-center"
      class:showingMore
      bind:clientHeight={showMoreHeight}
    >
      <button
        class="focus-outline group flex w-fit cursor-pointer flex-row items-center justify-center gap-x-1.5 rounded-md bg-neutral-300/50 px-2 py-1.5 text-sm transition-colors hover:bg-neutral-300 focus-visible:bg-neutral-300 dark:bg-neutral-500/50 hover:dark:bg-neutral-500 focus-visible:dark:bg-neutral-500"
        onclick={() => {
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
  @use '@styles/colors';
  @use '@styles/helpers';
  @use '@styles/mixins';

  @reference 'tailwindcss';

  .show-more-gradient {
    background: helpers.ease-gradient('to top', colors.$neutral-200, transparent);

    @include mixins.dark {
      background: helpers.ease-gradient('to top', colors.$neutral-700, transparent);
    }
  }

  :global(#hljs-container > pre) {
    white-space: break-spaces;
  }

  :global(#hljs-container > div > table) {
    max-width: 100%;
  }

  :global(#hljs-container > div > table > tbody > tr > td:nth-of-type(2)) {
    word-wrap: anywhere;
  }

  :global(tbody.hljs),
  :global(.hljs) {
    background-color: transparent !important;
  }

  :global(tbody.hljs) {
    @apply font-mono text-sm leading-5;
  }

  :global(code),
  :global(code.hljs) {
    @apply font-mono text-sm leading-5;
    max-width: 100%;
  }

  :global(code::selection),
  :global(code.hljs::selection) {
    background: colors.$orange-light !important;
    color: colors.$light !important;
  }

  :global(.dark code::selection),
  :global(.dark code.hljs::selection) {
    background: colors.$orange-light !important;
    color: colors.$dark !important;
  }
</style>
