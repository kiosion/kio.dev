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

  import { browser } from '$app/environment';
  import { t } from '$i18n';
  import Settings from '$stores/settings';

  import Hoverable from '$components/hoverable.svelte';
  import Spinner from '$components/loading/spinner.svelte';

  import Icon from './icon.svelte';
  import Tooltip from './tooltip.svelte';

  export let content: string,
    filename: string | undefined,
    showLineNumbers = true,
    lang: string | undefined = undefined;

  let hovered = false;
  let copied = false;

  let hlHighlight: Highlight,
    hlAuto: HighlightAuto,
    hlLang: Promise<LanguageType>,
    hlStyles: string | undefined,
    container: HTMLElement,
    codeContainer: HTMLElement,
    innerHeight: number,
    hideLoader = false;

  const id = Math.random().toString(36).substring(2),
    copy = () => {
      content && navigator.clipboard.writeText(content);

      if (!copied && hovered) {
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 1200);
      }
    },
    { theme } = Settings,
    unsubscribe = theme.subscribe(
      async (res) =>
        (hlStyles =
          res === 'light'
            ? (await import('svelte-highlight/styles/github')).default
            : (await import('svelte-highlight/styles/github-dark')).default)
    );

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

  $: browser && codeContainer && (codeContainer.style.height = `${innerHeight ?? 0}px`);
  $: browser && (hideLoader = innerHeight > 52);
</script>

<svelte:head>
  {#if hlStyles}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html hlStyles}
  {/if}
</svelte:head>

<div
  class="relative -mx-1 my-7 overflow-hidden rounded-sm border border-dark/40 duration-150 dark:border-light/40 {hovered
    ? 'border-dark/60 dark:border-light/60'
    : ''}"
  role="group"
  aria-label={$t('Code block')}
  aria-labelledby={filename ? `${id}-filename` : undefined}
  bind:this={container}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:focusin={() => (hovered = true)}
  on:focusout={() => (hovered = false)}
  on:blur={() => (hovered = false)}
>
  {#if filename}
    <div
      class="border-b border-dark/40 bg-dark/5 py-[13px] pl-5 font-mono text-base duration-150 dark:border-light/40 dark:bg-dark/40 {hovered
        ? 'border-dark/60 dark:border-light/60'
        : ''}"
      id="{id}-filename"
    >
      {filename}
    </div>
  {/if}
  <Hoverable>
    <Tooltip text={$t('Copy to clipboard')} position="left" delay={150} fixed>
      {#key copied}
        <button
          class="focusOutline-sm absolute right-0 top-0 z-[2] cursor-pointer rounded-sm pb-3 pl-3 pr-4 pt-4 text-dark/60 opacity-0 transition-opacity duration-150 hover:text-dark dark:text-light/60 dark:hover:text-light"
          class:opacity-100={hovered || filename}
          on:click={() => copy()}
          in:fade={{ duration: 100, delay: 100 }}
          out:fade={{ delay: 100, duration: 100 }}
        >
          <Icon icon={copied ? 'Check' : 'Copy'} />
        </button>
      {/key}
    </Tooltip>
  </Hoverable>
  <div
    class="focusOutline relative h-fit w-full overflow-hidden rounded-sm text-lg transition-[height]"
    bind:this={codeContainer}
  >
    <div
      class="h-fit w-full min-w-full rounded-sm p-1 transition-all dark:bg-dark/10 {hovered
        ? 'bg-dark/[0.025] dark:bg-light/5'
        : ''}"
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
        <span class="mt-11 block" />
      {/if}
      {#if !lang}
        <svelte:component this={hlAuto} code={content} />
      {:else}
        {#await hlLang then resolvedLang}
          <!-- <div class="mx-auto my-4 w-fit"><Spinner /></div> -->
          <!-- {:then resolvedLang} -->
          {#if showLineNumbers === true}
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
        {:catch error}
          <div>Error loading: {error.message}</div>
        {/await}
      {/if}
    </div>
  </div>
</div>
