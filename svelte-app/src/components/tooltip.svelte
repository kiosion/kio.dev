<script lang="ts">
  import { fade } from 'svelte/transition';

  export let text = '',
    position = 'bottom',
    transitionDuration = 150,
    delay = 600;

  let focused = false,
    id = Math.random().toString(36).substr(2, 9),
    container: HTMLDivElement,
    tooltip: HTMLDivElement;

  const getTarget = (parent: HTMLElement) => {
    if (!container) {
      return null;
    }
    let target = container.firstElementChild as HTMLElement;
    if (
      target.style.display === 'contents' ||
      target.classList.contains('contents')
    ) {
      target = target.firstElementChild as HTMLElement;
    }
    return target;
  };

  $: target = getTarget(container) as HTMLElement | null;
  $: targetRect = target?.getBoundingClientRect();
  $: if (target && targetRect && tooltip) {
    const tooltipWidth = parseInt(window.getComputedStyle(tooltip).width),
      tooltipHeight = parseInt(window.getComputedStyle(tooltip).height);
    const windowWidth = window.innerWidth,
      windowHeight = window.innerHeight;

    switch (position) {
      case 'bottom': {
        tooltip.style.top = `${targetRect.y + targetRect.height + 12}px`;
        tooltip.style.left = `${
          targetRect.x - targetRect.width / 2 - tooltipWidth / 2
        }px`;
        const tooltipRect = tooltip.getBoundingClientRect();

        if (tooltipRect.right + 8 > windowWidth) {
          tooltip.style.left = 'auto';
          tooltip.style.right = `${8}px`;
        }
        if (tooltipRect.bottom + 12 >= windowHeight) {
          tooltip.style.top = `${targetRect.y - tooltipHeight - 12}px`;
        }
        break;
      }
      case 'top': {
        tooltip.style.top = `${targetRect.y - tooltipHeight - 12}px`;
        tooltip.style.left = `${
          targetRect.x + targetRect.width / 2 - tooltipWidth / 2
        }px`;
        const tooltipRect = tooltip.getBoundingClientRect();

        if (tooltipRect.right + 8 > windowWidth) {
          tooltip.style.left = 'auto';
          tooltip.style.right = `${8}px`;
        }
        if (tooltipRect.top - 12 <= 0) {
          tooltip.style.top = `${targetRect.y + targetRect.height + 12}px`;
        }
        break;
      }
      case 'left': {
        tooltip.style.top = `${
          targetRect.y + targetRect.height / 2 - tooltipHeight
        }px`;
        tooltip.style.right = `${windowWidth - targetRect.x + 8}px`;
        const tooltipRect = tooltip.getBoundingClientRect();

        if (tooltipRect.left - 8 < 0) {
          tooltip.style.right = `${windowWidth - targetRect.x - 8}px`;
        }
        break;
      }
      case 'right': {
        tooltip.style.top = `${
          targetRect.y + targetRect.height / 2 - tooltipHeight / 2
        }px`;
        tooltip.style.left = `${targetRect.x + targetRect.width + 8}px`;
        const tooltipRect = tooltip.getBoundingClientRect();

        if (tooltipRect.right + 8 > windowWidth) {
          tooltip.style.left = 'auto';
          tooltip.style.right = `${8}px`;
        }
        break;
      }
    }
  }
</script>

<div
  class="container"
  on:mouseenter={() => (focused = true)}
  on:mouseleave={() => (focused = false)}
  on:focusin={() => (focused = true)}
  on:focusout={() => (focused = false)}
  on:keydown={(e) => {
    if (e.key === 'Escape') {
      focused = false;
    }
  }}
  bind:this={container}
>
  <slot />
  {#if focused}
    <div
      id={`tooltip-${id}`}
      class="tooltip text-sm font-code bg-slate-300 dark:bg-slate-900 shadow-md px-2 py-0.5 rounded-md select-none"
      in:fade={{ delay, duration: transitionDuration }}
      out:fade={{ duration: transitionDuration }}
      bind:this={tooltip}
    >
      {text}
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    display: contents;
    width: fit-contents;
    height: fit-contents;
  }
  .tooltip {
    position: fixed;
    z-index: 1;
    width: fit-content;
    height: fit-content;
    pointer-events: none;
    white-space: nowrap;
  }
</style>
