<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { get } from 'svelte/store';

  import { activeTarget, cursorTargets } from '$components/experiments/mag-cursor/utils';

  import type { CursorTarget } from '$components/experiments/mag-cursor/utils';

  export let containerRect: DOMRect | undefined = undefined;

  const size = 34,
    innerSize = 4,
    _lastPosition = { clientX: 0, clientY: 0 };

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

  const findDistance = ({ x, y }: { x: number; y: number }, rect: DOMRect) => {
    const hd = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0,
      vd = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;

    return Math.max(hd, vd);
  };

  const updateCursorPosition =
    (targets: CursorTarget[]) => (e?: { clientX: number; clientY: number }) => {
      const { clientX: x, clientY: y } = e ?? _lastPosition;

      _lastPosition.clientX = x;
      _lastPosition.clientY = y;

      if (
        containerRect &&
        (x < containerRect.left ||
          x > containerRect.right ||
          y < containerRect.top ||
          y > containerRect.bottom)
      ) {
        setVis(false);
        return;
      }

      let closestDistance = Infinity,
        closestTarget: CursorTarget | undefined = undefined;

      for (let i = 0; i < targets.length; ++i) {
        const target = targets[i],
          rect = target.element?.getBoundingClientRect();

        if (!rect) {
          continue;
        }

        const distance = findDistance({ x, y }, rect);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestTarget = target;
        }
      }

      if (hide) {
        setVis(true);
      }

      if (closestTarget === undefined || closestDistance >= closestTarget.snapDist) {
        get(activeTarget)?.offset?.set([0, 0]);
        activeTarget.set(undefined);

        cursorTween.set({
          x,
          y,
          width: size * (mouseDown ? 0.9 : 1),
          height: size * (mouseDown ? 0.9 : 1),
          borderRadius: size * (mouseDown ? 0.9 : 1)
        });
        innerCursorTween.set({
          x,
          y,
          width: innerSize * (mouseDown ? 3 : 1),
          height: innerSize * (mouseDown ? 3 : 1),
          borderRadius: innerSize * (mouseDown ? 3 : 1)
        });

        return;
      }

      const rect = closestTarget.element?.getBoundingClientRect();

      // this fucking sucks but idrc for this proj
      targets
        .filter((t) => t.id !== closestTarget?.id)
        .forEach((t) => t.offset?.set([0, 0]));

      if (!rect) {
        return;
      }

      activeTarget.set(closestTarget);

      if (closestTarget.snap !== true) {
        cursorTween.set({
          x,
          y,
          width: size * (mouseDown ? 1.2 : 1.5),
          height: size * (mouseDown ? 1.2 : 1.5),
          borderRadius: size * (mouseDown ? 1.2 : 1.5)
        });
        innerCursorTween.set({
          x,
          y,
          width: innerSize * (mouseDown ? 3 : 2),
          height: innerSize * (mouseDown ? 3 : 2),
          borderRadius: innerSize * (mouseDown ? 3 : 2)
        });
        return;
      }

      cursorTween.set({
        x: rect.left + rect.width / 2 + (x - (rect.left + rect.width / 2)) * 0.14,
        y: rect.top + rect.height / 2 + (y - (rect.top + rect.height / 2)) * 0.14,
        width: rect.width + closestTarget.size + (mouseDown ? 8 : 0),
        height: rect.height + closestTarget.size * 0.5 + (mouseDown ? 8 : 0),
        borderRadius: 8 * (mouseDown ? 2 : 1)
      });

      closestTarget.offset?.set([
        (x - (rect.left + rect.width / 2)) * 0.075,
        (y - (rect.top + rect.height / 2)) * 0.075
      ]);

      innerCursorTween.set({
        x,
        y,
        width: innerSize * (mouseDown ? 2 : 3),
        height: innerSize * (mouseDown ? 2 : 3),
        borderRadius: innerSize * (mouseDown ? 1 : 3)
      });
    };

  const handleClick = (e: MouseEvent) => {
    const targets = $cursorTargets,
      target = targets.find((t) => t.id === get(activeTarget)?.id);

    mouseDown = e.type === 'mousedown';

    if (e.type === 'mouseup') {
      target?.element?.click();
    }

    updateCursorPosition(targets)(e);
  };

  const setVis = (visible: boolean) => {
    hide = !visible;
    !visible && get(activeTarget)?.offset?.set([0, 0]);
    !visible && activeTarget.set(undefined);
  };

  $: updateCursorPosition($cursorTargets)();
</script>

<svelte:window
  on:mousemove={updateCursorPosition}
  on:mousemove={updateCursorPosition($cursorTargets)}
  on:mousedown={handleClick}
  on:mouseup={handleClick}
/>

{#if !hide}
  <div
    class="pointer-events-none fixed left-0 top-0 z-10 shadow-lg {$activeTarget !==
    undefined
      ? 'bg-dark/10 shadow-dark/5 dark:bg-light/10 dark:shadow-light/5'
      : 'bg-dark/15 shadow-transparent dark:bg-light/15'} transition-colors"
    style={`
transform: translate(calc(${$cursorTween.x}px - 50%), calc(${$cursorTween.y}px - 50%));
width: ${$cursorTween.width}px;
height: ${$cursorTween.height}px;
border-radius: ${$cursorTween.borderRadius}px;
`}
  />
  <div
    class="pointer-events-none fixed left-0 top-0 z-10 transition-colors {$activeTarget !==
    undefined
      ? 'bg-dark/20 dark:bg-light/20'
      : 'bg-dark/40 dark:bg-light/40'}"
    style={`
transform: translate(calc(${$innerCursorTween.x}px - 50%), calc(${$innerCursorTween.y}px - 50%));
width: ${$innerCursorTween.width}px;
height: ${$innerCursorTween.height}px;
border-radius: ${$innerCursorTween.borderRadius}px;
`}
  />
{/if}
