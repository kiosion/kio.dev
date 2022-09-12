<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { theme } from '$stores/theme';
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';

  export let appBody: HTMLElement;
  export let showLoader = true;

  let cursor: HTMLElement,
    cursorInner: HTMLElement,
    progressPath: SVGElement,
    loaderPath: SVGElement,
    mousePos = { x: 0, y: 0 },
    linkHover = false,
    hideCursor = true,
    cursorClick = false;

  const cursorTweenX = tweened(0, { duration: 28, easing: cubicInOut }),
    cursorTweenY = tweened(0, { duration: 28, easing: cubicInOut });

  onMount(() => {
    addHoverEvents();
    updateCursors();
  });

  onDestroy(() => {
    browser && removeHoverEvents();
  });

  const updateCursorPositions = (e: MouseEvent) => {
    hideCursor = false;
    mousePos = { x: e.clientX, y: e.clientY };
  };

  const updateCursors = () => {
    if (!cursor) {
      return;
    }
    cursorTweenX.set(mousePos.x);
    cursorTweenY.set(mousePos.y);

    requestAnimationFrame(updateCursors);
  };

  const hoverIn = () => {
    linkHover = true;
  };
  const hoverOut = () => {
    linkHover = false;
  };

  const addHoverEvents = () => {
    if (!document || !browser) {
      return;
    }
    const hoverables = document?.querySelectorAll('.hover-target');
    hoverables &&
      hoverables.forEach((hoverable) => {
        hoverable.addEventListener('mouseover', hoverIn);
        hoverable.addEventListener('mouseout', hoverOut);
      });
  };

  const removeHoverEvents = () => {
    if (!document || !browser) {
      return;
    }
    const hoverables = document?.querySelectorAll('.hover-target');
    hoverables &&
      hoverables.forEach((hoverable) => {
        hoverable.removeEventListener('mouseover', hoverIn);
        hoverable.removeEventListener('mouseout', hoverOut);
      });
  };

  // This is a pretty shit solution, but it works for now
  // until I can figure how to bubble events across
  // components w/out nesting
  const updateHoverEvents = () => {
    setTimeout(() => {
      removeHoverEvents();
      addHoverEvents();
    }, 150);
  };

  const initProgressPath = () => {
    if (!progressPath) {
      return;
    }
    const pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = `${pathLength}`;
  };

  const updateProgressPath = () => {
    if (!progressPath) {
      return;
    }
    const pathLength = progressPath.getTotalLength();
    const scroll = appBody.scrollTop;
    const height =
      appBody.scrollHeight - appBody.getBoundingClientRect().height;
    const progress = pathLength - (scroll * pathLength) / height;
    progressPath.style.strokeDashoffset = `${progress}`;
  };

  $: $page.url.pathname, initProgressPath(), updateHoverEvents(), hoverOut();
  $: appBody,
  appBody &&
      (appBody.removeEventListener('scroll', () => updateProgressPath),
      appBody.addEventListener('scroll', () => updateProgressPath()));
</script>

<svelte:window
  on:mousemove={updateCursorPositions}
  on:mouseout={() => (hideCursor = true)}
  on:mouseover={() => (hideCursor = false)}
  on:mousedown={() => {
    cursorClick = true;
    updateHoverEvents();
  }}
  on:mouseup={() => {
    cursorClick = false;
    hoverOut();
  }}
  on:keydown={(e) => {
    if (e.key === 'Tab') {
      hideCursor = true;
    }
  }}
/>

<div
  class="cursor-{$theme === 'light' ? 'light' : 'dark'} {hideCursor
    ? 'hidden'
    : 'block'}"
>
  <div
    class="dot {linkHover ? 'hovered' : ''} {cursorClick ? 'clicked' : ''}"
    style="left: {mousePos.x}px; top: {mousePos.y}px;"
    bind:this={cursorInner}
  />
  <div
    class="cursor {linkHover ? 'hovered' : ''} {cursorClick ? 'clicked' : ''}"
    style="left: {$cursorTweenX}px; top: {$cursorTweenY}px;"
    bind:this={cursor}
  >
    <div class="loader">
      <svg
        class={showLoader ? '' : 'opacity-0'}
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          bind:this={loaderPath}
          style={`
              stroke-dasharray: ${loaderPath?.getTotalLength()} ${loaderPath?.getTotalLength()};
              stroke-dashoffset: ${loaderPath?.getTotalLength() / 1.2};
            `}
        />
      </svg>
    </div>
    <div class="progress">
      <svg
        class={showLoader ? 'opacity-0' : ''}
        width="100%"
        height="100%"
        viewBox="-1 -1 104 104"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          bind:this={progressPath}
          style={`
            stroke-dasharray: ${progressPath?.getTotalLength()} ${progressPath?.getTotalLength()};
            stroke-dashoffset: ${progressPath?.getTotalLength()};
          `}
        />
      </svg>
    </div>
  </div>
</div>

<style lang="scss">
  .dot {
    position: fixed;
    pointer-events: none;
    width: 4px;
    height: 4px;
    z-index: 1001;
    border-radius: 1000px;
    transition: opacity 200ms ease, transform 200ms ease, width 200ms ease,
      height 200ms ease;
    transform: translate(-50%, -50%);
    background: rgba(233, 235, 245, 0.9);
    will-change: contents;

    .cursor-light & {
      background: rgba(50, 58, 77, 0.8);
    }

    &.hovered {
      transform: scale(2) translate(-28%, -28%);
      opacity: 0.6;
    }
    &.clicked {
      transform: scale(4) translate(-18%, -18%);
      opacity: 0.01;
    }
  }
  .cursor {
    position: fixed;
    width: 38px;
    height: 38px;
    z-index: 1000;
    border-radius: 1000px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: transform 200ms ease, background 200ms ease;
    background: rgba(217, 229, 252, 0.1);
    will-change: contents;

    .cursor-light & {
      background: rgba(75, 82, 100, 0.08);
    }

    &.hovered {
      background: rgba(217, 229, 252, 0.2);
      transform: scale(1.2) translate(-42%, -42%);
      border: none;
      transition: transform 200ms ease, background 200ms ease;

      .cursor-light & {
        background: rgba(75, 82, 100, 0.1);
      }
      &.clicked {
        transform: scale(0.8) translate(-65%, -65%);
      }
    }
    &.clicked {
      background: rgba(217, 229, 252, 0.25);
      border: none;
      transition: transform 200ms ease, background 200ms ease;

      .cursor-light & {
        background: rgba(75, 82, 100, 0.25);
      }
      &,
      &.hovered {
        transform: scale(0.8) translate(-65%, -65%);
      }
    }
  }
  .loader {
    transition: none;
    svg {
      animation: spin 1s ease infinite;
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .loader,
  .progress {
    position: absolute;
    height: 38px;
    width: 38px;
    border-radius: 10000px;
    z-index: 1000;
    box-shadow: inset 0 0 0 2px rgba(217, 229, 252, 0.1);
    transition: all 200ms ease;

    .cursor-light & {
      box-shadow: inset 0 0 0 2px rgba(56, 66, 85, 0.08);
    }

    .hovered & {
      box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0);
      transition: all 200ms ease;

      path {
        opacity: 0.4;
      }
    }

    .clicked & {
      box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0);
      transition: all 200ms ease;

      path {
        opacity: 0.01;
      }
    }

    .cursor-light .hovered &,
    .cursor-light .clicked & {
      box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0);
    }

    svg,
    svg path {
      transition: opacity 200ms ease;
    }

    path {
      fill: none;
      stroke: rgba(233, 235, 245, 0.8);
      stroke-width: 5;
      box-sizing: border-box;
      transition: stroke-dashoffset 10ms ease;

      .cursor-light & {
        stroke: rgba(50, 58, 77, 0.8);
      }
    }
  }
  .progress {
    .hovered & {
      path {
        opacity: 0.01;
      }
    }
  }
</style>
