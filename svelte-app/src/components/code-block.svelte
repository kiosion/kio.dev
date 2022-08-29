<script lang="ts">
  import Icon from '@iconify/svelte';
  import { theme } from '$stores/theme';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects } from '$stores/features';
  import { fade } from 'svelte/transition';
  import { navigating } from '$app/stores';

  export let content: string;
  export let showClipboard = false;

  let hovered = false;
  let copied = false;

  let hlComponent: unknown;
  let hlStyles: unknown;

  let mousePos = [0, 0];
  let container: HTMLElement;
  let glow: HTMLElement;

  $: [clientX, clientY] = mousePos;

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
    if ($highlightEffects === 'on') {
      document.addEventListener('mousemove', (e) => {
        mousePos = [e.clientX, e.clientY];
      });
    }

    hlComponent = (await import('svelte-highlight')).HighlightAuto;
  });

  onDestroy(() => {
    if ($highlightEffects === 'on') {
      document.removeEventListener('mousemove', (e) => {
        mousePos = [e.clientX, e.clientY];
      });
    }

    unsubscribeTheme();
  });

  const mouseMove = () => {
    if ($highlightEffects !== 'on' && !$navigating) {
      return;
    }
    try {
      const { top, left } = container.getBoundingClientRect();
      glow.style && (glow.style.left = `${clientX - left}px`);
      glow.style && (glow.style.top = `${clientY - top}px`);
    } catch {
      () => undefined;
    }
  };

  $: clientX, clientY, mouseMove();
</script>

<svelte:head>
  {#if hlStyles}
    {@html hlStyles}
  {/if}
</svelte:head>

<div
  class="relative p-[1px] my-6 overflow-hidden rounded-md {hovered
    ? 'active'
    : ''}"
  bind:this={container}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:focus={() => (hovered = true)}
  on:blur={() => (hovered = false)}
>
  {#if showClipboard && !$navigating}
    {#key copied}
      <button
        class="{hovered
          ? 'opacity-100'
          : 'opacity-0'} cursor-pointer m-2 p-2 absolute z-10 top-0 right-0 transition-opacity duration-150 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        on:click={() => copy()}
        in:fade={{ duration: 200 }}
        out:fade={{ delay: 200, duration: 200 }}
      >
        <Icon icon="fa-solid:{copied ? 'clipboard-check' : 'clipboard'}" />
      </button>
    {/key}
  {/if}
  <div class="relative overflow-scroll rounded-md w-full text-lg md:text-md">
    <div
      class="rounded-md min-w-full w-fit h-fit p-1 bg-slate-200 dark:bg-slate-900 is-{$theme} transition-all duration-150"
    >
      <svelte:component this={hlComponent} code={content} />
    </div>
  </div>
  {#if $highlightEffects === 'on' && !$navigating}
    <div bind:this={glow} class="absolute unfilled w-[800px] h-[800px]" />
  {/if}
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
    z-index: -2;
    + div {
      z-index: -3;
    }
  }
  .cover,
  .filled {
    transition: opacity 150ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .unfilled {
    z-index: -1;
    top: -9999px;
    left: -9999px;
    background: radial-gradient(#94a3b8, transparent 35%);
    transform: translate(-50%, -50%);
  }
</style>
