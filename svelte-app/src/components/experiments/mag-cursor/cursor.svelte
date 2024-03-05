<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  export let targets: HTMLElement[],
    containerRect: DOMRect,
    snapped: number | undefined = undefined;

  const size = 28,
    innerSize = 4,
    snapDistance = 65;

  let cursor = { x: 0, y: 0, width: size, height: size, borderRadius: size / 2 },
    innerCursor = {
      x: 0,
      y: 0,
      width: innerSize,
      height: innerSize,
      borderRadius: innerSize / 2
    },
    hide = true;

  const cursorTween = tweened(cursor, {
      duration: 250,
      easing: cubicOut
    }),
    innerCursorTween = tweened(innerCursor, {
      duration: 150,
      easing: cubicOut
    });

  const updateCursorPosition = (e: MouseEvent) => {
    const { clientX: x, clientY: y } = e;

    if (
      !containerRect ||
      x < containerRect.left ||
      x > containerRect.right ||
      y < containerRect.top ||
      y > containerRect.bottom
    ) {
      hide = true;
      return;
    }

    hide = false;

    let closestDistance = Infinity,
      closestTarget: number | undefined = undefined;

    for (let i = 0; i < targets.length; ++i) {
      const rect = targets[i].getBoundingClientRect(),
        centerX = rect.left + rect.width / 2,
        centerY = rect.top + rect.height / 2,
        distance = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));

      if (distance < closestDistance) {
        closestDistance = distance;
        closestTarget = i;
      }
    }

    if (closestTarget !== undefined && closestDistance < snapDistance) {
      const rect = targets[closestTarget].getBoundingClientRect();
      snapped = closestTarget;
      cursorTween.set({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        borderRadius: 8
      });
      innerCursorTween.set({
        x: e.clientX,
        y: e.clientY,
        width: innerSize + 2,
        height: innerSize + 2,
        borderRadius: innerSize / 2
      });
    } else {
      if (snapped !== undefined) {
        snapped = undefined;
      }
      cursorTween.set({
        x: e.clientX,
        y: e.clientY,
        width: size,
        height: size,
        borderRadius: size / 2
      });
      innerCursorTween.set({
        x: e.clientX,
        y: e.clientY,
        width: innerSize,
        height: innerSize,
        borderRadius: innerSize / 2
      });
    }
  };
</script>

<svelte:window on:mousemove={updateCursorPosition} />

{#if !hide}
  <div
    class="pointer-events-none fixed left-0 top-0 {snapped !== undefined
      ? 'bg-dark/10 dark:bg-light/10'
      : 'bg-dark/5 dark:bg-light/5'} transition-colors"
    style={`
transform: translate(calc(${$cursorTween.x}px - 50%), calc(${$cursorTween.y}px - 50%));
width: ${$cursorTween.width}px;
height: ${$cursorTween.height}px;
border-radius: ${$cursorTween.borderRadius}px;
`}
  />
  <div
    class="pointer-events-none fixed left-0 top-0 bg-dark/10 transition-colors dark:bg-light/10"
    style={`
transform: translate(calc(${$innerCursorTween.x}px - 50%), calc(${$innerCursorTween.y}px - 50%));
width: ${$innerCursorTween.width}px;
height: ${$innerCursorTween.height}px;
border-radius: ${$innerCursorTween.borderRadius}px;
`}
  />
{/if}
