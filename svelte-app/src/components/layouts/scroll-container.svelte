<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  import { navigating } from '$app/stores';

  import type { Navigation } from '@sveltejs/kit';
  import type { Unsubscriber } from 'svelte/store';

  export let element: HTMLDivElement;

  let unsubscribe: Unsubscriber,
    navState: Navigation | null = null,
    lastInvocationTime = 0,
    debounceTimeout: ReturnType<typeof setTimeout> | null = null,
    startY = 0;

  const debounceDelay = 100,
    dispatcher = createEventDispatcher(),
    childIsOverflowing = (element: HTMLElement): boolean =>
      (element.firstElementChild?.firstElementChild?.firstElementChild?.clientHeight ||
        0) >= element.clientHeight;

  const executeScrollLogic = (direction: 'up' | 'down') => {
    if (!childIsOverflowing(element)) {
      return;
    }

    if (direction === 'down') {
      dispatcher('scrollDown');
    } else {
      dispatcher('scrollUp');
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentTime = Date.now(),
      moveY = e.touches[0].clientY,
      direction: 'up' | 'down' = moveY < startY ? 'down' : 'up';

    if (currentTime - lastInvocationTime < debounceDelay) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      debounceTimeout = setTimeout(() => {
        executeScrollLogic(direction);
      }, debounceDelay);

      return;
    }

    lastInvocationTime = currentTime;
    executeScrollLogic(direction);
  };

  const handleScroll = (e: WheelEvent) => {
    const currentTime = Date.now();

    if (currentTime - lastInvocationTime < debounceDelay || !e.deltaY) {
      return;
    }

    lastInvocationTime = currentTime;

    if (!childIsOverflowing(element)) {
      return;
    }

    if (e.deltaY > 1) {
      dispatcher('scrollDown');
    } else if (e.deltaY < -1) {
      dispatcher('scrollUp');
    }
  };

  // TODO: Fix handling of touch events - checking touchstart
  // doesn't always work when scrolling fast / flick scrolling
  // on:wheel={handleScroll}
  // on:touchstart={handleTouchStart}
  // on:touchmove={handleTouchMove}

  onMount(() => {
    unsubscribe ||= navigating.subscribe((state) => {
      state && (navState = state);

      if (state !== null) {
        return;
      }

      if (navState) {
        element.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  });

  onDestroy(() => unsubscribe?.());
</script>

<div
  class="relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8"
  tabindex="-1"
  role="none"
  bind:this={element}
>
  <slot />
</div>
