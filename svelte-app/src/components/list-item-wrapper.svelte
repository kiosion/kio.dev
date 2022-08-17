<script lang="ts">
  import { highlightEffects } from '@/stores/features';
  import { navigating } from '$app/stores';

  export let mousePos = [0, 0];
  export let hovered: boolean;

  $: [clientX, clientY] = mousePos;
  $: active = hovered;

  let glow: HTMLElement;
  let container: HTMLElement;

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

<div
  class="relative p-[1px] mt-6 overflow-hidden rounded-md {active
    ? 'active'
    : ''}"
  bind:this={container}
>
  <slot />

  {#if $highlightEffects === 'on' && !$navigating}
    <div bind:this={glow} class="absolute unfilled w-[800px] h-[800px]" />
  {/if}
  <div
    class="absolute filled top-[-4px] left-[-4px] w-[110%] h-[110%] bg-slate-400 {active
      ? '!opacity-60'
      : ''} opacity-0 rounded-md"
  />
  <div
    class="absolute top-[-4px] left-[-4px] w-[110%] h-[110%] bg-slate-200 dark:bg-slate-900 transition-colors duration-[120ms]"
  />
</div>

<style lang="scss">
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
