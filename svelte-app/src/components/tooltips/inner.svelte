<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';

  import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset as offsetFn,
    shift
  } from '@floating-ui/dom';

  import type { ComputePositionConfig, Placement } from '@floating-ui/dom';
  import type { TransitionConfig } from 'svelte/transition';

  export let id: number,
    className: string | undefined = undefined,
    duration: number,
    placement: Placement,
    offset: number,
    followCursor: boolean,
    showArrow: boolean,
    transition: ((node: Element, args?: unknown) => TransitionConfig) | undefined =
      undefined,
    target: HTMLElement;

  let tooltipElement: HTMLDivElement,
    arrowElement: HTMLSpanElement,
    position = { x: 0, y: 0 },
    cleanup: () => void,
    maybeTransition =
      transition && duration > 0
        ? transition
        : (_node: Element, _args?: unknown): TransitionConfig => ({});

  const calculatePosition = async (e?: MouseEvent) => {
    if (!browser || !target || !tooltipElement) {
      return;
    }

    let targetToUse = target;

    if (followCursor && e) {
      targetToUse = {
        getBoundingClientRect: () => ({
          left: e.clientX,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          width: offset * 1.5,
          height: offset * 1.5
        })
      } as HTMLElement;
    }

    const middleware: ComputePositionConfig['middleware'] = [
      offsetFn(offset),
      flip(),
      shift({ padding: 10 })
    ];

    if (showArrow) {
      middleware.push(arrow({ element: arrowElement }));
    }

    const {
      x,
      y,
      placement: actualPlacement,
      middlewareData
    } = await computePosition(targetToUse, tooltipElement, {
      placement,
      middleware
    });

    position.x = x;
    position.y = y;

    if (showArrow) {
      const staticSide = (
        {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right'
        } as const
      )[actualPlacement.split('-')[0]]!;

      Object.assign(arrowElement.style, {
        left: middlewareData.arrow?.x ? `${middlewareData.arrow.x}px` : '',
        top: middlewareData.arrow?.y ? `${middlewareData.arrow.y}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px'
      });
    }
  };

  onMount(() => {
    if (!target || !tooltipElement) {
      return;
    }

    cleanup = autoUpdate(target, tooltipElement, calculatePosition, {
      animationFrame: false
    });

    if (followCursor) {
      target.addEventListener('mousemove', calculatePosition);
    }
  });

  onDestroy(() => {
    cleanup?.();
    target?.removeEventListener('mousemove', calculatePosition);
  });
</script>

<div
  style="left: {position.x}px; top: {position.y}px;"
  class="pointer-events-none absolute z-50 print:hidden"
  id={`tooltip-${id}`}
  bind:this={tooltipElement}
  aria-hidden="true"
  in:maybeTransition={{ duration }}
  out:maybeTransition={{ duration }}
>
  <span class="block px-2 py-1.5 {className || ''}">
    <slot />
  </span>
  {#if showArrow}
    <span
      class="absolute block h-2 w-2 rotate-45 bg-neutral-600 dark:bg-neutral-100"
      bind:this={arrowElement}
    ></span>
  {/if}
</div>
