<script lang="ts">
  import { onMount } from 'svelte';

  import Divider from '$components/divider.svelte';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import ClipboardDocument from '$components/icons/clipboard-document.svelte';
  import ClipboardDocumentCheck from '$components/icons/clipboard-document-check.svelte';
  import DocumentTextSmall from '$components/icons/document-text-small.svelte';
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
  import Plaintext from 'svelte-highlight/languages/plaintext';
  import LineNumbers from 'svelte-highlight/LineNumbers.svelte';

  type SHLanguageUnion = Extract<keyof typeof SHLanguages, string>;

  const {
    content,
    filename,
    showLineNumbers = true,
    lang,
  }: {
    content: string;
    filename?: string;
    showLineNumbers?: boolean;
    lang?: string;
  } = $props();

  let langTypePromise = $state<Promise<SHLanguageType<SHLanguageUnion>> | undefined>(
    undefined,
  );
  let hideLoader = $state(false);
  let copied = $state<ReturnType<typeof setTimeout> | undefined>(undefined);

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
          (BASE_ANIMATION_DURATION / 2) * 10,
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
      return Plaintext;
    }
  };

  onMount(() => {
    langTypePromise = getLangType(lang?.toLowerCase()).finally(() => (hideLoader = true));
  });
</script>

<div
  class="relative my-5 rounded-sm bg-neutral-100/50 transition-colors dark:bg-neutral-600/50"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}>
  {#if filename}
    <div
      class="flex flex-row items-center justify-start gap-x-4 bg-neutral-200/50 px-8 py-4 font-mono text-sm transition-colors dark:bg-neutral-800/5"
      id="{id}-filename">
      <DocumentTextSmall class="text-neutral-500 dark:text-neutral-300" />
      <span>{filename}</span>
    </div>
    <Divider margin="my-0"></Divider>
  {/if}

  <div
    class="pointer-events-none absolute top-4 right-4 h-fit w-fit transition-opacity"
    class:opacity-0={hideLoader}
    aria-hidden="true">
    <Spinner />
  </div>
  <Tooltip content={$t('Copy to clipboard')} placement="left">
    {#snippet children({ id: tooltipId })}
      <button
        class="focus-outline-sm text-dark/80 hover:text-dark focus-visible:text-dark dark:text-light/80 hover:dark:text-light focus-visible:dark:text-light absolute right-0 z-[2] mt-2 mr-2.5 cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs opacity-0 transition-colors hover:bg-neutral-300/50 focus-visible:bg-neutral-300/50 hover:dark:bg-neutral-500 focus-visible:dark:bg-neutral-500"
        class:opacity-100={hideLoader}
        onclick={() => copy()}
        onkeydown={(e) => e.key === 'Enter' && copy()}
        aria-label={copied !== undefined ? $t('Copied') : $t('Copy to clipboard')}
        aria-describedby={tooltipId}
        type="button">
        {#if copied !== undefined}
          <ClipboardDocumentCheck />
        {:else}
          <ClipboardDocument />
        {/if}
      </button>
    {/snippet}
  </Tooltip>
  <div
    class="focus-outline relative h-fit min-h-16 w-full overflow-hidden rounded-sm text-lg transition-[height,color]">
    <ErrorBoundary>
      <div
        class="h-fit w-full min-w-full rounded-sm p-1 pr-8 pl-4 transition-all"
        id="hljs-container"
        aria-hidden="true">
        {#if langTypePromise}
          {#await langTypePromise}
            <Highlight code={content} language={Plaintext} let:highlighted>
              {#if showLineNumbers === true}
                <LineNumbers {highlighted} hideBorder wrapLines />
              {/if}
            </Highlight>
          {:then resolvedLang}
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
              Error loading: {error.message}
            </div>
          {/await}
        {:else}
          <Highlight code={content} language={Plaintext} let:highlighted>
            {#if showLineNumbers === true}
              <LineNumbers {highlighted} hideBorder wrapLines />
            {/if}
          </Highlight>
        {/if}
      </div>
    </ErrorBoundary>
    <p class="sr-only" aria-label={$t('Code content')}>{content}</p>
  </div>
</div>

<style lang="scss">
  @use '@styles/colors';
  @use '@styles/helpers';
  @use '@styles/mixins';

  @reference 'tailwindcss';

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
