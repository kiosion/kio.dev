<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { classList } from 'svelte-body';

  import { afterNavigate } from '$app/navigation';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  let element: HTMLDivElement, timeout: ReturnType<typeof setTimeout> | undefined;

  export let shadow = {
    top: false,
    bottom: false
  };

  const onScroll = (e?: Event) => {
    e && window.dispatchEvent(new CustomEvent('scroll', { detail: e }));

    if (!shadow) {
      return;
    }

    shadow.top = element.scrollTop > 10;
    shadow.bottom = element.scrollTop + element.clientHeight < element.scrollHeight - 10;
  };

  onMount(onScroll);

  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  afterNavigate(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      onScroll();
      element?.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, BASE_TRANSITION_DURATION);
  });

  const DEFAULT_MAX_WIDTH_PX = 1216, // 76rem
    DEFAULT_MIN_WIDTH_PX = 682;

  let mouseDown: 'r' | 'l' | false = false,
    handleHovered: 'r' | 'l' | false = false,
    maxWidthPx = DEFAULT_MAX_WIDTH_PX;

  const handleMouseMove = (e: MouseEvent) => {
    if (!mouseDown) {
      return;
    }

    e.preventDefault();

    switch (mouseDown) {
      case 'r':
        if (maxWidthPx + e.movementX * 2 < DEFAULT_MIN_WIDTH_PX) {
          maxWidthPx = DEFAULT_MIN_WIDTH_PX;
          break;
        }
        maxWidthPx += e.movementX * 2;
        break;
      case 'l':
        if (maxWidthPx - e.movementX * 2 < DEFAULT_MIN_WIDTH_PX) {
          maxWidthPx = DEFAULT_MIN_WIDTH_PX;
          break;
        }
        maxWidthPx -= e.movementX * 2;
        break;
    }
  };
</script>

<svelte:window
  on:mouseup={() => (mouseDown = false)}
  on:mousemove={handleMouseMove}
  on:blur={() => ((mouseDown = false), (handleHovered = false))}
/>

<svelte:body
  use:classList={{ 'select-none': mouseDown, 'cursor-col-resize': mouseDown }}
/>

<div
  class="relative mx-auto flex h-full w-full flex-col rounded-sm border border-dark/80 bg-neutral-50 shadow-lg shadow-dark/10 transition-colors dark:border-light/60 dark:bg-black dark:shadow-black/40"
  style="max-width: {maxWidthPx}px;"
>
  <!-- right drag-handle -->
  <div
    class="absolute -right-2 bottom-0 top-0 hidden w-4 cursor-col-resize md:block"
    on:mousedown={() => (mouseDown = 'r')}
    on:mouseenter={() => (handleHovered = 'r')}
    on:mouseleave={() => (handleHovered = false)}
    role="presentation"
  />
  <div
    class="absolute -right-2 bottom-1 top-1 w-0.5 rounded-full bg-orange-light opacity-0 transition-opacity"
    class:opacity-100={mouseDown === 'r'}
    class:opacity-50={handleHovered === 'r' && !mouseDown}
  />
  <!-- left drag handle -->
  <div
    class="absolute -left-2 bottom-0 top-0 hidden w-4 cursor-col-resize md:block"
    on:mousedown={() => (mouseDown = 'l')}
    on:mouseenter={() => (handleHovered = 'l')}
    on:mouseleave={() => (handleHovered = false)}
    role="presentation"
  />
  <div
    class="absolute -left-2 bottom-1 top-1 w-0.5 rounded-full bg-orange-light opacity-0 transition-opacity"
    class:opacity-100={mouseDown === 'l'}
    class:opacity-50={handleHovered === 'l' && !mouseDown}
  />

  <slot name="before" {shadow} />

  <div
    class="relative h-full flex-1 overflow-visible overflow-x-clip overflow-y-scroll"
    tabindex="-1"
    role="none"
    id="scroll-container"
    data-test-id="scroll-container"
    bind:this={element}
    on:scroll={onScroll}
    on:wheel={onScroll}
  >
    <slot {element} {shadow} />
  </div>

  <slot name="after" {shadow} />
</div>

<style lang="scss">
  @import '@styles/colors';
  @import '@styles/mixins';

  #scroll-container {
    scrollbar-color: $neutral-100 $white;

    @include dark {
      scrollbar-color: $neutral-400 $black;
    }
  }
</style>
