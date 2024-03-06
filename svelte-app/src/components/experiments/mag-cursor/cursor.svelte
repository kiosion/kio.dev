<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { get } from 'svelte/store';

  import {
    activeTarget,
    BASE_CURSOR_INNER_SIZE,
    BASE_CURSOR_SIZE,
    BASE_TWEEN_MS,
    BASE_TWEEN_MS_FAST,
    cursorTargets,
    findDistance
  } from '$components/experiments/mag-cursor/utils';

  import type { CursorTarget } from '$components/experiments/mag-cursor/utils';

  export let containerRect: DOMRect | undefined = undefined;

  let mouseDown = false,
    hidden = true;

  const _lastPosition = { clientX: 0, clientY: 0 },
    cursor = tweened(
      {
        x: 0,
        y: 0,
        width: BASE_CURSOR_SIZE,
        height: BASE_CURSOR_SIZE,
        borderRadius: BASE_CURSOR_SIZE / 2
      },
      {
        duration: BASE_TWEEN_MS,
        easing: cubicOut
      }
    ),
    innerCursor = tweened(
      {
        x: 0,
        y: 0,
        width: BASE_CURSOR_INNER_SIZE,
        height: BASE_CURSOR_INNER_SIZE,
        borderRadius: BASE_CURSOR_INNER_SIZE / 2
      },
      {
        duration: BASE_TWEEN_MS_FAST,
        easing: cubicOut
      }
    );

  const update =
    (targets: CursorTarget[]) => (e?: { clientX: number; clientY: number }) => {
      const x = e?.clientX || _lastPosition.clientX,
        y = e?.clientY || _lastPosition.clientY;

      if (typeof x === 'number' && typeof y === 'number') {
        _lastPosition.clientX = x;
        _lastPosition.clientY = y;
      }

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

      for (const target of targets) {
        const rect = target.element?.getBoundingClientRect();

        if (!rect) {
          continue;
        }

        const distance = findDistance({ x, y }, rect);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestTarget = target;
        }
      }

      if (hidden) {
        setVis(true);
      }

      if (!closestTarget || closestDistance >= closestTarget.snapDist) {
        get(activeTarget)?.offset?.set([0, 0]);
        activeTarget.set(undefined);

        cursor.set({
          x,
          y,
          width: BASE_CURSOR_SIZE * (mouseDown ? 0.9 : 1),
          height: BASE_CURSOR_SIZE * (mouseDown ? 0.9 : 1),
          borderRadius: (BASE_CURSOR_SIZE * (mouseDown ? 0.9 : 1)) / 2
        });
        innerCursor.set({
          x,
          y,
          width: BASE_CURSOR_INNER_SIZE * (mouseDown ? 3 : 1),
          height: BASE_CURSOR_INNER_SIZE * (mouseDown ? 3 : 1),
          borderRadius: (BASE_CURSOR_INNER_SIZE * (mouseDown ? 3 : 1)) / 2
        });

        return;
      }

      const rect = closestTarget.element?.getBoundingClientRect();

      // this fucking sucks but idrc for this proj
      for (const target of targets) {
        if (target.id === closestTarget.id) {
          continue;
        }

        target.offset?.set([0, 0]);
      }

      if (!rect) {
        return;
      }

      activeTarget.set(closestTarget);

      if (closestTarget.snap !== true) {
        cursor.set({
          x,
          y,
          width: BASE_CURSOR_SIZE * (mouseDown ? 1.2 : 1.5),
          height: BASE_CURSOR_SIZE * (mouseDown ? 1.2 : 1.5),
          borderRadius: (BASE_CURSOR_SIZE * (mouseDown ? 1.2 : 1.5)) / 2
        });
        innerCursor.set({
          x,
          y,
          width: BASE_CURSOR_INNER_SIZE * (mouseDown ? 3 : 2),
          height: BASE_CURSOR_INNER_SIZE * (mouseDown ? 3 : 2),
          borderRadius: (BASE_CURSOR_INNER_SIZE * (mouseDown ? 3 : 2)) / 2
        });
        return;
      }

      const rectCenter = [rect.left + rect.width / 2, rect.top + rect.height / 2];

      cursor.set({
        x: rectCenter[0] + (x - rectCenter[0]) * 0.14,
        y: rectCenter[1] + (y - rectCenter[1]) * 0.14,
        width: rect.width + closestTarget.size + (mouseDown ? 8 : 0),
        height: rect.height + closestTarget.size * 0.5 + (mouseDown ? 8 : 0),
        borderRadius: 8 * (mouseDown ? 2 : 1)
      });

      // offset should be exponential - i.e., the further the x,y from the center of the target, the more the offset
      closestTarget.offset?.set([(x - rectCenter[0]) * 0.08, (y - rectCenter[1]) * 0.08]);

      innerCursor.set({
        x,
        y,
        width: BASE_CURSOR_INNER_SIZE * (mouseDown ? 2 : 4),
        height: BASE_CURSOR_INNER_SIZE * (mouseDown ? 2 : 4),
        borderRadius: (BASE_CURSOR_INNER_SIZE * (mouseDown ? 2 : 4)) / 2
      });
    };

  const handleClick = (e: MouseEvent) => {
    const targets = $cursorTargets,
      target = targets.find((t) => t.id === get(activeTarget)?.id);

    mouseDown = e.type === 'mousedown';

    if (e.type === 'mouseup') {
      target?.element?.click();
    }

    update(targets)(e);
  };

  const setVis = (visible: boolean) => {
    hidden = !visible;
    !visible && get(activeTarget)?.offset?.set([0, 0]);
    !visible && activeTarget.set(undefined);
  };

  $: update($cursorTargets)();
</script>

<svelte:window
  on:mousemove={update($cursorTargets)}
  on:mousedown={handleClick}
  on:mouseup={handleClick}
  on:scroll={update($cursorTargets)}
/>

{#if !hidden}
  <div
    class="pointer-events-none fixed left-0 top-0 z-10 shadow-lg {$activeTarget !==
    undefined
      ? 'bg-dark/10 shadow-dark/5 dark:bg-light/10 dark:shadow-light/5'
      : 'bg-dark/15 shadow-transparent dark:bg-light/15'} transition-colors"
    style={`
transform: translate(calc(${$cursor.x}px - 50%), calc(${$cursor.y}px - 50%));
width: ${$cursor.width}px;
height: ${$cursor.height}px;
border-radius: ${$cursor.borderRadius}px;
`}
  />
  <div
    class="pointer-events-none fixed left-0 top-0 z-10 transition-colors {$activeTarget !==
    undefined
      ? 'bg-dark/20 dark:bg-light/20'
      : 'bg-dark/40 dark:bg-light/40'}"
    style={`
transform: translate(calc(${$innerCursor.x}px - 50%), calc(${$innerCursor.y}px - 50%));
width: ${$innerCursor.width}px;
height: ${$innerCursor.height}px;
border-radius: ${$innerCursor.borderRadius}px;
`}
  />
{/if}
