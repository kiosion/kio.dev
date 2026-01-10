<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte';

  import type { ComputePositionConfig, OffsetOptions, Placement } from '@floating-ui/dom';
  import {
    autoUpdate,
    computePosition,
    flip,
    offset as offsetFn,
    shift,
  } from '@floating-ui/dom';
  import { browser } from '$app/environment';
  import type { TransitionConfig } from 'svelte/transition';

  let {
    children,
    id,
    className = undefined,
    duration,
    placement,
    offset,
    followCursor,
    transition = undefined,
    target,
  }: {
    children: Snippet;
    id: number;
    className: string | undefined;
    duration: number;
    placement: Placement;
    offset: number | [number, number];
    followCursor: boolean;
    transition: ((node: Element, args?: unknown) => TransitionConfig) | undefined;
    target: HTMLElement;
  } = $props();

  let tooltipElement: HTMLDivElement | null = $state(null),
    position = $state({ x: 0, y: 0 }),
    cleanup: () => void,
    maybeTransition = $derived(
      transition && duration > 0
        ? transition
        : (_node: Element, _args?: unknown): TransitionConfig => ({}),
    ),
    offsetValue = $derived({
      mainAxis: typeof offset === 'number' ? offset : offset[0],
      crossAxis: typeof offset === 'number' ? undefined : offset[1],
    } satisfies OffsetOptions);

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
          width: (offsetValue.crossAxis ?? offsetValue.mainAxis) * 1.5,
          height: offsetValue.mainAxis * 1.5,
        }),
      } as HTMLElement;
    }

    const middleware: ComputePositionConfig['middleware'] = [
      offsetFn(offsetValue),
      flip(),
      shift({ padding: 10 }),
    ];

    const {
      x,
      y,
      placement: actualPlacement,
      middlewareData,
    } = await computePosition(targetToUse, tooltipElement, {
      placement,
      middleware,
    });

    position.x = x;
    position.y = y;
  };

  onMount(() => {
    if (!target || !tooltipElement) {
      return;
    }

    cleanup = autoUpdate(target, tooltipElement, calculatePosition, {
      animationFrame: false,
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
  <span class="block px-3 py-2 {className || ''}">
    {@render children()}
  </span>
</div>
