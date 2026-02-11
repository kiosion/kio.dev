<script lang="ts">
  import { onMount } from 'svelte';

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
  class="relative my-5 rounded-sm border border-neutral-200 dark:border-neutral-500"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}>
  <div
    class="absolute top-0 right-0 left-0 flex h-fit flex-row items-center justify-between border-neutral-200 px-5 py-4 font-mono text-sm transition-colors dark:border-neutral-500"
    class:justify-end={!filename}
    class:absolute={!filename}
    class:border-b={filename}>
    {#if filename}
      <div class="flex flex-row items-center justify-start gap-x-4" id="{id}-filename">
        <DocumentTextSmall class="text-neutral-500 dark:text-neutral-300" />
        <span>{filename}</span>
      </div>
    {/if}
    <Tooltip content={$t('Copy to clipboard')} placement="left">
      <button
        class="focus-outline-sm text-dark/80 dark:text-light/80 hover:text-orange-light focus-visible:text-orange-light z-[2] -m-2 cursor-pointer rounded-md p-2 opacity-0 transition-colors"
        class:opacity-100={hideLoader}
        onclick={() => copy()}
        onkeydown={(e) => e.key === 'Enter' && copy()}
        aria-label={copied !== undefined ? $t('Copied') : $t('Copy to clipboard')}
        type="button">
        {#if copied !== undefined}
          <ClipboardDocumentCheck />
        {:else}
          <ClipboardDocument />
        {/if}
      </button>
    </Tooltip>
    <div
      class="pointer-events-none absolute top-4.5 right-6 h-fit w-fit transition-opacity"
      class:opacity-0={hideLoader}
      aria-hidden="true">
      <Spinner />
    </div>
  </div>

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
