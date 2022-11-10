<script lang="ts">
  import { theme } from '$stores/theme';
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { navigating } from '$app/stores';
  import SafeIcon from './icons/safe-icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import type { HighlightAuto, Highlight } from 'svelte-highlight';

  export let content: string;
  export let showClipboard = false;
  export let lang: string | undefined;

  let hovered = false;
  let copied = false;

  let hlHighlight: Highlight;
  let hlAuto: HighlightAuto;
  let hlLang: unknown;
  let hlStyles: unknown;

  let container: HTMLElement;
  let codeContainer: HTMLElement;
  let innerHeight: number;

  const copy = () => {
    content && navigator.clipboard.writeText(content);
    clicked();
  };

  const clicked = async () => {
    if (!copied && hovered) {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 1200);
    }
  };

  const unsubscribeTheme = theme.subscribe(async (res) => {
    if (res === 'light') {
      hlStyles = (await import('svelte-highlight/styles/ros-pine-dawn'))
        .default;
    } else {
      hlStyles = (await import('svelte-highlight/styles/ros-pine-moon'))
        .default;
    }
  });

  onMount(async () => {
    !lang
      ? (hlAuto = (await import('svelte-highlight'))
          .HighlightAuto as unknown as HighlightAuto)
      : (hlHighlight = (await import('svelte-highlight'))
          .Highlight as unknown as Highlight);

    hlLang = (async () => {
      switch (lang) {
        case 'markdown':
          return await import('svelte-highlight/languages/markdown');
        case 'javascript':
          return await import('svelte-highlight/languages/javascript');
        case 'typescript':
          return await import('svelte-highlight/languages/typescript');
      }
    })();
  });

  onDestroy(() => {
    unsubscribeTheme();
  });

  $: codeContainer && (codeContainer.style.height = `${innerHeight ?? 0}px`);
</script>

<svelte:head>
  {#if hlStyles}
    <!-- @html is usually a terrible idea, in this case it should be fine since it's a stylesheet from a trusted pkg -->
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
  on:focus={() => (hovered = true)}
  on:blur={() => (hovered = false)}
>
  {#if showClipboard && !$navigating}
    <Hoverable>
      {#key copied}
        <button
          class="{hovered
            ? 'opacity-100'
            : 'opacity-0'} cursor-pointer m-2 p-2 absolute z-10 top-0 right-0 transition-opacity duration-150 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          on:click={() => copy()}
          in:fade={{ duration: 100, delay: 100 }}
          out:fade={{ delay: 100, duration: 100 }}
        >
          {#if copied}
            <SafeIcon icon={'Check'} />
          {:else}
            <SafeIcon icon={'Copy'} />
          {/if}
        </button>
      {/key}
    </Hoverable>
  {/if}
  <div
    class="relative z-[4] overflow-y-hidden overflow-x-scroll rounded-md w-full text-lg md:text-md h-[0px] transition-[height]"
    bind:this={codeContainer}
  >
    <div
      class="rounded-md min-w-full w-fit h-fit p-1 bg-slate-200 dark:bg-slate-900 is-{$theme} transition-all duration-150"
      bind:clientHeight={innerHeight}
    >
      {#if !lang}
        <svelte:component this={hlAuto} code={content} />
      {:else}
        <svelte:component this={hlHighlight} code={content} lang={hlLang} />
      {/if}
    </div>
  </div>
  <div
    class="absolute filled top-[-4px] left-[-4px] w-[120%] h-[120%] bg-slate-400 {hovered
      ? '!opacity-60'
      : ''} opacity-0 rounded-md"
  />
  <div
    class="absolute top-[-4px] left-[-4px] w-[120%] h-[120%] bg-slate-200 dark:bg-slate-900 transition-colors duration-[120ms]"
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
  .filled {
    z-index: 2;
    + div {
      z-index: 1;
    }
  }
  .cover,
  .filled {
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
