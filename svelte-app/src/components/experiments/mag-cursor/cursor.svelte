<script lang="ts">
  import type { CursorTarget } from '$components/experiments/mag-cursor/utils';
  import {
    activeTarget,
    BASE_CURSOR_INNER_SIZE,
    BASE_CURSOR_SIZE,
    BASE_TWEEN_MS,
    BASE_TWEEN_MS_FAST,
    cursorTargets,
    findDistance
  } from '$components/experiments/mag-cursor/utils';
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { get } from 'svelte/store';

  export let containerRect: DOMRect | undefined = undefined,
    useOffset = true;

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

      if (
        !closestTarget ||
        closestDistance >= closestTarget.snapDist ||
        get(activeTarget) !== closestTarget
      ) {
        if (get(activeTarget)?.snap === true) {
          const fakeMouseOut = new MouseEvent('mouseleave', {
            view: window,
            bubbles: true,
            cancelable: true
          });

          get(activeTarget)?.element?.dispatchEvent(fakeMouseOut);
        }
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

      // if 'snap' is true, we want to trigger a fake 'hover'/'mouseover' series of events since the real
      // cursor may not be over the target yet but we want tooltips etc to trigger
      const fakeMouseOver = new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      });

      closestTarget.element?.dispatchEvent(fakeMouseOver);

      const rectCenter = [rect.left + rect.width / 2, rect.top + rect.height / 2];

      cursor.set({
        x: useOffset ? rectCenter[0] + (x - rectCenter[0]) * 0.12 : rectCenter[0],
        y: useOffset ? rectCenter[1] + (y - rectCenter[1]) * 0.12 : rectCenter[1],
        width: rect.width + closestTarget.size + (mouseDown ? 8 : 0),
        height: rect.height + closestTarget.size * 0.5 + (mouseDown ? 8 : 0),
        borderRadius: 8 * (mouseDown ? 2 : 1)
      });

      // offset should be exponential - i.e., the further the x,y from the center of the target, the more the offset
      useOffset &&
        closestTarget.offset?.set([
          (x - rectCenter[0]) * 0.14,
          (y - rectCenter[1]) * 0.14
        ]);

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

    if (!visible) {
      const fakeMouseOut = new MouseEvent('mouseleave', {
        view: window,
        bubbles: true,
        cancelable: true
      });

      get(activeTarget)?.element?.dispatchEvent(fakeMouseOut);
      get(activeTarget)?.offset?.set([0, 0]);
      activeTarget.set(undefined);
    }
  };

  $: update($cursorTargets)();
  $: ({
    x: cursorX,
    y: cursorY,
    width: cursorWidth,
    height: cursorHeight,
    borderRadius: cursorBorderRadius
  } = $cursor);
  $: ({
    x: innerCursorX,
    y: innerCursorY,
    width: innerCursorWidth,
    height: innerCursorHeight,
    borderRadius: innerCursorBorderRadius
  } = $innerCursor);
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
    style="transform: translate(calc({cursorX}px - 50%), calc({cursorY}px - 50%)); width: {cursorWidth}px; height: {cursorHeight}px; border-radius: {cursorBorderRadius}px;"
  ></div>
  <div
    class="pointer-events-none fixed left-0 top-0 z-10 backdrop-blur-sm transition-colors {$activeTarget !==
    undefined
      ? 'bg-dark/20 dark:bg-light/20'
      : 'bg-dark/40 dark:bg-light/40'}"
    style="transform: translate(calc({innerCursorX}px - 50%), calc({innerCursorY}px - 50%)); width: {innerCursorWidth}px; height: {innerCursorHeight}px; border-radius: {innerCursorBorderRadius}px;"
  ></div>
{/if}
