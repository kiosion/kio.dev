<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  export let targets: HTMLElement[],
    containerRect: DOMRect,
    activeTarget: number | undefined = undefined;

  const size = 28,
    innerSize = 4,
    snapDistance = 68;

  let cursor = { x: 0, y: 0, width: size, height: size, borderRadius: size / 2 },
    innerCursor = {
      x: 0,
      y: 0,
      width: innerSize,
      height: innerSize,
      borderRadius: innerSize / 2
    },
    mouseDown = false,
    hide = true;

  const cursorTween = tweened(cursor, {
      duration: 275,
      easing: cubicOut
    }),
    innerCursorTween = tweened(innerCursor, {
      duration: 125,
      easing: cubicOut
    });

  const updateCursorPosition = (e: { clientX: number; clientY: number }) => {
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
      const rect = targets[i]?.getBoundingClientRect();

      if (!rect) {
        continue;
      }

      const centerX = rect.left + rect.width / 2,
        centerY = rect.top + rect.height / 2,
        distance = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));

      if (distance < closestDistance) {
        closestDistance = distance;
        closestTarget = i;
      }
    }

    if (closestTarget === undefined || closestDistance >= snapDistance) {
      activeTarget = undefined;

      cursorTween.set({
        x: e.clientX,
        y: e.clientY,
        width: size * (mouseDown ? 1.5 : 1),
        height: size * (mouseDown ? 1.5 : 1),
        borderRadius: size * (mouseDown ? 1.5 : 1)
      });

      innerCursorTween.set({
        x: e.clientX,
        y: e.clientY,
        width: innerSize * (mouseDown ? 2 : 1),
        height: innerSize * (mouseDown ? 2 : 1),
        borderRadius: innerSize * (mouseDown ? 2 : 1)
      });

      return;
    }

    const rect = targets[closestTarget].getBoundingClientRect();

    activeTarget = closestTarget;

    cursorTween.set({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width + (mouseDown ? 8 : 0),
      height: rect.height + (mouseDown ? 8 : 0),
      borderRadius: 8 * (mouseDown ? 2 : 1)
    });

    innerCursorTween.set({
      x: e.clientX,
      y: e.clientY,
      width: innerSize * (mouseDown ? 2 : 4),
      height: innerSize * (mouseDown ? 2 : 4),
      borderRadius: innerSize * (mouseDown ? 1 : 2)
    });
  };

  const handleClick = (e: MouseEvent) => {
    mouseDown = e.type === 'mousedown';
    updateCursorPosition(e);
  };
</script>

<svelte:window
  on:mousemove={updateCursorPosition}
  on:mousedown={handleClick}
  on:mouseup={handleClick}
/>

{#if !hide}
  <div
    class="pointer-events-none fixed left-0 top-0 shadow-lg {activeTarget !== undefined
      ? 'bg-dark/5 shadow-dark/5 dark:bg-light/5 dark:shadow-light/5'
      : 'bg-dark/10 shadow-transparent dark:bg-light/10'} transition-colors"
    style={`
transform: translate(calc(${$cursorTween.x}px - 50%), calc(${$cursorTween.y}px - 50%));
width: ${$cursorTween.width}px;
height: ${$cursorTween.height}px;
border-radius: ${$cursorTween.borderRadius}px;
`}
  />
  <div
    class="pointer-events-none fixed left-0 top-0 bg-dark/20 transition-colors dark:bg-light/20"
    style={`
transform: translate(calc(${$innerCursorTween.x}px - 50%), calc(${$innerCursorTween.y}px - 50%));
width: ${$innerCursorTween.width}px;
height: ${$innerCursorTween.height}px;
border-radius: ${$innerCursorTween.borderRadius}px;
`}
  />
{/if}
