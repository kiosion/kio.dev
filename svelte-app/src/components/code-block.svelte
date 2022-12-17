<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck Need to fix typings for hlAuto and hlHighlight
  import { theme } from '$stores/theme';
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { navigating } from '$app/stores';
  import Icon from './icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import type {
    HighlightAuto,
    Highlight,
    LanguageType
  } from 'svelte-highlight';

  export let content: string,
    showClipboard = false,
    lang: string | undefined = undefined;

  let hovered = false;
  let copied = false;

  let hlHighlight: Highlight,
    hlAuto: HighlightAuto,
    hlLang: LanguageType,
    hlStyles: unknown,
    container: HTMLElement,
    codeContainer: HTMLElement,
    innerHeight: number;

  const copy = () => {
    content && navigator.clipboard.writeText(content);
    clicked();
  };

  const clicked = () => {
    if (!copied && hovered) {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 1200);
    }
  };

  const unsubscribe = theme.subscribe(async (res) => {
    if (res === 'light') {
      hlStyles = (await import('svelte-highlight/styles/github')).default;
    } else {
      hlStyles = (await import('svelte-highlight/styles/github-dark')).default;
    }
  });

  onMount(async () => {
    !lang
      ? (hlAuto = await import('svelte-highlight')).HighlightAuto
      : (hlHighlight = (await import('svelte-highlight'))
          .Highlight as unknown as Highlight);

    hlLang = await (async () => {
      switch (lang) {
        case 'javascript':
          return (await import('svelte-highlight/languages/javascript'))
            .javascript;
        case 'typescript':
          return (await import('svelte-highlight/languages/typescript'))
            .typescript;
        case 'sh':
        case 'shell':
          return (await import('svelte-highlight/languages/shell')).shell;
        case 'bash':
          return (await import('svelte-highlight/languages/bash')).bash;
        case 'elixir':
          return (await import('svelte-highlight/languages/elixir')).elixir;
        case 'haskell':
          return (await import('svelte-highlight/languages/haskell')).haskell;
        case 'ruby':
          return (await import('svelte-highlight/languages/ruby')).ruby;
        case 'python':
          return (await import('svelte-highlight/languages/python')).python;
        case 'java':
          return await import('svelte-highlight/languages/java');
        case 'json':
          return await import('svelte-highlight/languages/json');
        case 'yaml':
          return await import('svelte-highlight/languages/yaml');
        case 'html':
        case 'xml':
          return (await import('svelte-highlight/languages/xml')).xml;
        case 'css':
          return (await import('svelte-highlight/languages/css')).css;
        case 'sass':
        case 'scss':
          return (await import('svelte-highlight/languages/scss')).scss;
        case 'markdown':
        default:
          return (await import('svelte-highlight/languages/markdown')).markdown;
      }
    })();
  });

  onDestroy(() => unsubscribe());

  $: codeContainer && (codeContainer.style.height = `${innerHeight ?? 0}px`);
</script>

<svelte:head>
  {#if hlStyles}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html hlStyles}
  {/if}
</svelte:head>

<div
  class="z-[4] relative p-[1px] my-6 overflow-hidden rounded-md {hovered
    ? 'active'
    : ''}"
  bind:this={container}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:focusin={() => (hovered = true)}
  on:focusout={() => (hovered = false)}
  on:blur={() => (hovered = false)}
>
  {#if showClipboard && !$navigating}
    <Hoverable>
      {#key copied}
        <button
          class="{hovered
            ? 'opacity-100'
            : 'opacity-0'} cursor-pointer m-2 p-2 rounded-sm absolute z-10 top-0 right-0 transition-opacity duration-150 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 focusOutline-sm"
          on:click={() => copy()}
          in:fade={{ duration: 100, delay: 100 }}
          out:fade={{ delay: 100, duration: 100 }}
        >
          {#if copied}
            <Icon icon={'Check'} />
          {:else}
            <Icon icon={'Copy'} />
          {/if}
        </button>
      {/key}
    </Hoverable>
  {/if}
  <div
    class="relative z-[4] overflow-y-hidden overflow-x-scroll rounded-md w-full text-lg md:text-md h-[0px] transition-[height] focusOutline"
    bind:this={codeContainer}
  >
    <div
      class="rounded-md min-w-full w-fit h-fit p-1 bg-slate-200 dark:bg-slate-900 is-{$theme} transition-all duration-150"
      bind:clientHeight={innerHeight}
    >
      {#if !lang}
        <svelte:component this={hlAuto} code={content} />
      {:else}
        <svelte:component this={hlHighlight} code={content} language={hlLang} />
      {/if}
    </div>
  </div>
  <div
    class="absolute filled -top-[1px] -left-[1px] -right-[1px] -bottom-[1px] w-[calc(100%_+_1px)] h-[calc(100%_+_1px)] bg-slate-400 {hovered
      ? '!opacity-60'
      : ''} opacity-0 rounded-md"
  />
</div>

<style lang="scss">
  :global(code.hljs) {
    background-color: transparent;
    font-family: 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco,
      Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 1rem;
    line-height: 1.2rem;
    max-width: 100%;

    &::selection {
      background: #34d399 !important;
      color: #1e293b !important;
    }
  }
  :global(code.hljs *) {
    &::selection {
      background: #34d399 !important;
      color: #1e293b !important;
    }
  }
  .cover {
    transition: opacity 150ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .unfilled {
    z-index: 2;
    top: -9999px;
    left: -9999px;
    background: radial-gradient(#94a3b8, transparent 35%);
    transform: translate(-50%, -50%);
  }
</style>
