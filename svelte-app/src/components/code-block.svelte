<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { t } from '$i18n';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import Settings from '$stores/settings';

  import {
    getLangType,
    Highlight as _Highlight,
    HighlightSvelte as _HighlightSvelte,
    LineNumbers as _LineNumbers
  } from '$components/code-block/imports';
  import Icon from '$components/icon.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import type { Unsubscriber } from 'svelte/store';
  import type { LanguageType as _LanguageType } from 'svelte-highlight/languages';

  export let content: string,
    filename: string | undefined,
    showLineNumbers = true,
    lang: string | undefined;

  let LanguageType: Promise<_LanguageType<string>>,
    HighlightSvelte: Promise<_HighlightSvelte | undefined>,
    LineNumbers: Promise<_LineNumbers | undefined>,
    Highlight: Promise<_Highlight>,
    HighlightStyles: string | undefined,
    codeContainer: HTMLElement,
    innerHeight: number,
    hideLoader = false,
    copied: ReturnType<typeof setTimeout> | undefined;

  const id = Math.random().toString(36).substring(2),
    copy = () => {
      content && navigator.clipboard.writeText(content);

      if (copied === undefined) {
        copied = setTimeout(() => {
          copied = undefined;
        }, (BASE_ANIMATION_DURATION / 2) * 10);
      }
    },
    { theme } = Settings,
    unsubscribers: Unsubscriber[] = [];

  onMount(() => {
    lang = lang?.toLowerCase();

    unsubscribers.push(
      theme.subscribe(
        async (res) =>
          (HighlightStyles =
            res === 'light'
              ? (await import('svelte-highlight/styles/github')).default
              : (await import('svelte-highlight/styles/github-dark')).default)
      ),
      _LineNumbers(showLineNumbers).subscribe((res) => (LineNumbers = res)),
      _HighlightSvelte(lang === 'svelte').subscribe((res) => (HighlightSvelte = res)),
      _Highlight().subscribe((res) => (Highlight = res))
    );

    LanguageType = getLangType(lang);
  });

  onDestroy(() => {
    unsubscribers.forEach((unsub) => unsub());
  });

  $: browser && codeContainer && (codeContainer.style.height = `${innerHeight ?? 0}px`);
  $: browser && (hideLoader = innerHeight > 52);
</script>

<svelte:head>
  {#if HighlightStyles}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html HighlightStyles}
  {/if}
</svelte:head>

<div
  class="relative -mx-1 my-7 overflow-hidden rounded-sm border border-dark/40 transition-none focus-within:border-dark/60 hover:border-dark/60 focus-visible:border-dark/60 dark:border-light/40 focus-within:dark:border-light/60 hover:dark:border-light/60 focus-visible:dark:border-light/60"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}
>
  {#if filename}
    <div
      class="border-b border-dark/30 bg-dark/5 py-[13px] pl-5 font-mono text-base transition-[background-color] dark:border-light/30 dark:bg-dark/40"
      id="{id}-filename"
    >
      {filename}
    </div>
  {/if}
  <Tooltip text={$t('Copy to clipboard')} position="left" delay={200} fixed>
    <button
      class="focusOutline-sm absolute right-0 top-0 z-[2] cursor-pointer rounded-sm pb-3 pl-3 pr-4 pt-4 text-dark/60 hover:text-dark/80 dark:text-light/60 dark:hover:text-light/80"
      on:click={() => copy()}
      on:keydown={(e) => e.key === 'Enter' && copy()}
    >
      {#key copied}
        <Icon icon={copied !== undefined ? 'Check' : 'Copy'} />
      {/key}
    </button>
  </Tooltip>
  <div
    class="focusOutline relative h-fit w-full overflow-hidden rounded-sm text-lg transition-[height]"
    bind:this={codeContainer}
  >
    <div
      class="h-fit w-full min-w-full rounded-sm p-1 transition-all dark:bg-dark/10"
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
        <div>Error loading: {error.message}</div>
      {/await}
    </div>
  </div>
</div>
