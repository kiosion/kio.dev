<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { cubicInOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';

  import { browser } from '$app/environment';

  import type { Tooltip } from '$lib/tooltips';

  const PADDING_PX = 8,
    MAX_LENGTH = 72;

  export let id: Tooltip['id'],
    content: Tooltip['content'],
    duration: Tooltip['duration'],
    placement: Tooltip['placement'],
    followCursor: Tooltip['followCursor'],
    offset: Tooltip['offset'],
    target: Tooltip['target'],
    container: HTMLDivElement | undefined = undefined;

  onMount(() => {
    if (followCursor && target) {
      target.addEventListener('mousemove', calculatePosition);
    }

    calculatePosition();
  });

  onDestroy(() => {
    if (followCursor && target) {
      target.removeEventListener('mousemove', calculatePosition);
    }
  });

  let tooltipElement: HTMLDivElement,
    position = { x: 0, y: 0 };

  const calculatePosition = async (e?: MouseEvent) => {
    if (!browser || !target || !tooltipElement) {
      return;
    }

    await tick();

    const tooltipRect = tooltipElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const pageScroll = {
      x: container?.scrollLeft ?? window.scrollX,
      y: container?.scrollTop ?? window.scrollY
    };
    const { innerWidth, innerHeight } = window;

    if (followCursor && e) {
      position = {
        x: Math.max(0, Math.min(innerWidth, e.clientX + offset[0])),
        y: Math.max(0, Math.min(innerHeight, e.clientY + offset[1]))
      };

      return;
    }

    let x = pageScroll.x,
      y = pageScroll.y;

    switch (placement) {
      case 'top':
        x += targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y += targetRect.top - targetRect.height - tooltipRect.height;
        break;
      case 'bottom':
        x += targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y += targetRect.top + targetRect.height;
        break;
      case 'left':
        x += targetRect.left;
        y += targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x += targetRect.left + targetRect.width;
        y += targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'top-start':
        x += targetRect.left;
        y += targetRect.top;
        break;
      case 'top-end':
        x += targetRect.left + targetRect.width;
        y += targetRect.top;
        break;
      case 'bottom-start':
        x += targetRect.left;
        y += targetRect.top + targetRect.height;
        break;
      case 'bottom-end':
        x += targetRect.left + targetRect.width;
        y += targetRect.top + targetRect.height;
        break;
      case 'left-start':
        x += targetRect.left;
        y += targetRect.top;
        break;
      case 'left-end':
        x += targetRect.left;
        y += targetRect.top + targetRect.height;
        break;
      case 'right-start':
        x += targetRect.left + targetRect.width;
        y += targetRect.top;
        break;
      case 'right-end':
        x += targetRect.left + targetRect.width;
        y += targetRect.top + targetRect.height;
        break;
    }

    // if x-pos will result in tooltip being off-screen, adjust it
    if (x + tooltipRect.width > innerWidth + pageScroll.x - PADDING_PX) {
      x = innerWidth + pageScroll.x - tooltipRect.width - PADDING_PX;
    } else if (x < PADDING_PX) {
      x = PADDING_PX;
    }

    // same for height
    if (y + tooltipRect.height > innerHeight + pageScroll.y - PADDING_PX) {
      y = innerHeight + pageScroll.y - tooltipRect.height - PADDING_PX;
    } else if (y < PADDING_PX) {
      y = PADDING_PX;
    }

    position = {
      x: Math.max(0, Math.min(innerWidth + pageScroll.x, x + offset[0])),
      y: Math.max(0, Math.min(innerHeight + pageScroll.y, y + offset[1]))
    };
  };

  $: calculatePosition(), [target, tooltipElement, placement, followCursor];
  $: style = `left: ${position.x}px; top: ${position.y}px;`;
</script>

<div
  {style}
  class="pointer-events-none absolute z-50"
  id={`tooltip-${id}`}
  bind:this={tooltipElement}
>
  <span
    class="block whitespace-nowrap rounded-sm bg-black px-2 py-1 font-code text-sm text-light dark:bg-light dark:text-dark"
    transition:fade={{ duration, easing: cubicInOut }}
  >
    {content.trim().length >= MAX_LENGTH
      ? `${content.trim().slice(0, MAX_LENGTH - 3)}...`
      : content.trim()}
  </span>
</div>
