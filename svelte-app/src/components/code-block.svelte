<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck Need to fix typings for hlAuto and hlHighlight
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import {
    type Highlight,
    type HighlightAuto,
    type LanguageType,
    LineNumbers
  } from 'svelte-highlight';

  import { navigating } from '$app/stores';
  import { t } from '$i18n';
  import Settings from '$stores/settings';

  import Hoverable from '$components/hoverable.svelte';

  import Icon from './icon.svelte';
  import Tooltip from './tooltip.svelte';

  export let content: string,
    filename: string | undefined,
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

  const { theme } = Settings;

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
              await import(`../../node_modules/svelte-highlight/languages/${lang}.js`)
            )[lang];
            break;
          }
        }
      } catch (e) {
        imp = (await import('svelte-highlight/languages/markdown')).markdown;
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
  {#if filename}
    <div class="codeBlock--filename">
      <span>{filename}</span>
    </div>
  {/if}
  {#if showClipboard && !$navigating}
    <Hoverable>
      <Tooltip text={$t('Copy to clipboard')} position="left" delay={150} fixed>
        {#key copied}
          <button
            class="codeBlock--copyButton focusOutline-sm"
            on:click={() => copy()}
            class:visible={hovered || filename}
            in:fade={{ duration: 100, delay: 100 }}
            out:fade={{ delay: 100, duration: 100 }}
          >
            <Icon icon={copied ? 'Check' : 'Copy'} />
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
          <svelte:component this={hlHighlight} code={content} language={resolvedLang} />
        {/if}
      {/await}
    </div>
  </div>
</div>
