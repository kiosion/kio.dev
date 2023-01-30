<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck Need to fix typings for hlAuto and hlHighlight
  import { theme } from '$stores/theme';
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { navigating } from '$app/stores';
  import Icon from './icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import {
    LineNumbers,
    type HighlightAuto,
    type Highlight,
    type LanguageType
  } from 'svelte-highlight';
  import Tooltip from './tooltip.svelte';
  import { t } from '$i18n';

  export let content: string,
    showClipboard = false,
    showLineNumbers = true,
    lang: string | undefined = undefined;

  let hovered = false;
  let copied = false;

  let hlHighlight: Highlight,
    hlAuto: HighlightAuto,
    hlLang: Promise<LanguageType>,
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

    hlLang = (async () => {
      lang = lang?.toLowerCase();
      if (!lang) {
        return (await import('svelte-highlight/languages/markdown')).markdown;
      }

      let imp: LanguageType | undefined;
      try {
        // First, handle some cases where the name isn't the import name
        switch (lang) {
          case 'c#': {
            imp = (await import('svelte-highlight/languages/csharp')).csharp;
            break;
          }
          case 'c++': {
            imp = (await import('svelte-highlight/languages/cpp')).cpp;
            break;
          }
          case 'html': {
            imp = (await import('svelte-highlight/languages/xml')).xml;
            break;
          }
          case 'sh':
          case 'shell': {
            imp = (await import('svelte-highlight/languages/bash')).bash;
            break;
          }
          default: {
            imp = (
              await import(
                `../../node_modules/svelte-highlight/languages/${lang}.js`
              )
            )[lang];
            break;
          }
        }
      } catch (e) {
        imp = (
          await import(
            '../../node_modules/svelte-highlight/languages/markdown.js'
          )
        ).markdown;
      }
      return imp as LanguageType;
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
  class="codeBlock--container"
  class:active={hovered}
  bind:this={container}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:focusin={() => (hovered = true)}
  on:focusout={() => (hovered = false)}
  on:blur={() => (hovered = false)}
>
  {#if showClipboard && !$navigating}
    <Hoverable>
      <Tooltip text={t('Copy to clipboard')} position="top">
        {#key copied}
          <button
            class="copyButton focusOutline-sm"
            on:click={() => copy()}
            class:visible={hovered}
            in:fade={{ duration: 100, delay: 100 }}
            out:fade={{ delay: 100, duration: 100 }}
          >
            {#if copied}
              <Icon icon="Check" />
            {:else}
              <Icon icon="Copy" />
            {/if}
          </button>
        {/key}
      </Tooltip>
    </Hoverable>
  {/if}
  <div class="codeBlock--codeContainer focusOutline" bind:this={codeContainer}>
    <div
      class="inner is-{$theme} transition-all"
      class:active={hovered}
      bind:clientHeight={innerHeight}
    >
      {#await hlLang then resolvedLang}
        {#if !lang}
          <svelte:component this={hlAuto} code={content} />
        {:else if showLineNumbers === true}
          <svelte:component
            this={hlHighlight}
            code={content}
            language={resolvedLang}
            let:highlighted
          >
            <LineNumbers {highlighted} hideBorder wrapLines />
          </svelte:component>
        {:else}
          <svelte:component
            this={hlHighlight}
            code={content}
            language={resolvedLang}
          />
        {/if}
      {/await}
    </div>
  </div>
</div>

<style lang="scss">
  @import '../styles/colors';

  .codeBlock--container {
    @apply relative my-6 -mx-2 overflow-hidden rounded-md border-stone-400/40 border transition-colors;

    &.active {
      @apply border-stone-400;
    }
  }

  .codeBlock--codeContainer {
    @apply relative overflow-hidden rounded-md w-full text-lg h-[0px] transition-[height];

    .inner {
      @apply rounded-md min-w-full w-fit h-fit p-1 bg-stone-300/40 transition-all;

      &.active {
        @apply bg-stone-300;
      }
    }
  }

  .copyButton {
    @apply opacity-0 cursor-pointer m-2 p-2 rounded-sm absolute z-10 top-0 right-0 transition-opacity duration-150 text-stone-600 hover:text-stone-800;

    &.visible {
      @apply opacity-100;
    }
  }

  :global(.dark) {
    .codeBlock--container {
      @apply border-stone-500/20;

      &.active {
        @apply border-stone-500/60;
      }
    }

    .codeBlock--codeContainer .inner {
      @apply bg-stone-900;

      &.active {
        @apply bg-stone-900/60;
      }
    }
    .copyButton {
      @apply text-stone-400 hover:text-stone-200;
    }
  }

  :global(.hljs) {
    background-color: transparent !important;
  }

  :global(code) {
    &,
    &.hljs {
      background-color: transparent !important;
      font-family: 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco,
        Consolas, 'Liberation Mono', 'Courier New', monospace !important;
      font-size: 1rem;
      line-height: 1.2rem;
      max-width: 100%;

      & {
        &::selection {
          background: $violet-300 !important;
          color: $gray-900 !important;
        }
      }
    }
  }

  :global(tbody.hljs) {
    background-color: transparent !important;
    font-family: 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco,
      Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 1rem;
    line-height: 1.2rem;
  }
</style>
