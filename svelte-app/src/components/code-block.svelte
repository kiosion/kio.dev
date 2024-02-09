<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import { genericAsyncImport, getLangType } from '$components/code-block/imports';
  import Icon from '$components/icon.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import type { ResolvedComponentType } from '$components/code-block/imports';
  import type { Unsubscriber } from 'svelte/store';
  import type { LanguageType as _LanguageType } from 'svelte-highlight/languages';

  export let content: string,
    filename: string | undefined,
    showLineNumbers = true,
    lang: string | undefined;

  let LanguageType: Promise<_LanguageType<string>>,
    HighlightSvelte: Promise<ResolvedComponentType<'HighlightSvelte'> | undefined>,
    LineNumbers: Promise<ResolvedComponentType<'LineNumbers'> | undefined>,
    Highlight: Promise<ResolvedComponentType<'Highlight'> | undefined>,
    HighlightStyles: string | undefined,
    codeContainer: HTMLElement,
    innerHeight: number,
    hideLoader = false,
    copied: ReturnType<typeof setTimeout> | undefined,
    loadError: Error | null = null;

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
    },
    { theme } = Settings,
    unsubscribers: Unsubscriber[] = [];

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

    unsubscribers.push(
      theme.subscribe(
        async (res) =>
          (HighlightStyles =
            res === 'light'
              ? (await import('svelte-highlight/styles/github')).default
              : (await import('svelte-highlight/styles/github-dark')).default)
      )
    );

    LanguageType = getLangType(lang);
  });

  onDestroy(() => {
    unsubscribers.forEach((unsub) => unsub());
  });

  const updateHeight = (height?: number) =>
    codeContainer && height && (codeContainer.style.height = `${height}px`);

  $: updateHeight(innerHeight),
    browser && (hideLoader = loadError !== null || innerHeight > 52);
</script>

<svelte:head>
  {#if HighlightStyles}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html HighlightStyles}
  {/if}
</svelte:head>

<div
  class="relative -mx-1 my-7 overflow-hidden rounded-sm border border-dark/20 transition-colors dark:border-light/20"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}
>
  {#if filename}
    <div
      class="border-b border-dark/20 bg-dark/5 py-[13px] pl-5 font-mono text-base transition-[background-color,border-color] dark:border-light/20"
      id="{id}-filename"
    >
      {filename}
    </div>
  {/if}
  <Tooltip text={$t('Copy to clipboard')} delay={200} offset={[0, 2]} fixed>
    <button
      class="focusOutline-sm absolute right-0 top-0 z-[2] cursor-pointer rounded-sm pb-3 pl-3 pr-4 pt-4 text-dark/60 hover:text-dark/80 dark:text-light/60 dark:hover:text-light/80"
      on:click={() => copy()}
      on:keydown={(e) => e.key === 'Enter' && copy()}
    >
      {#key copied}
        <Icon name={copied !== undefined ? 'Check' : 'Copy'} />
      {/key}
    </button>
  </Tooltip>
  <div
    class="focusOutline relative h-fit w-full overflow-hidden rounded-sm text-lg transition-[height,color]"
    bind:this={codeContainer}
  >
    <div
      class="h-fit w-full min-w-full rounded-sm bg-dark/5 p-1 transition-all"
      id="hljs-container"
      bind:clientHeight={innerHeight}
    >
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transition-opacity"
        class:opacity-0={hideLoader}
      >
        <Spinner />
      </div>
      {#if !hideLoader}
        <span class="pointer-events-none mt-11 block" />
      {/if}
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
          <div class="p-3 font-code text-sm">Error loading: {error.message}</div>
        {/await}
      {:else}
        <div class="p-3 font-code text-sm">Error loading: {loadError.message}</div>
      {/if}
    </div>
  </div>
</div>
