<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import Logger from '$lib/logger';

  import tippy, { followCursor, type Instance } from 'tippy.js';

  import type { Placement } from '@popperjs/core';

  export let text = '',
    position: Placement = 'bottom',
    transitionDuration = 200,
    delay = 1400,
    disable = false,
    offset = [0, 8] as [number, number],
    fixed = false;

  let container: HTMLDivElement, instance: Instance;

  onMount(() => {
    const target = container?.firstChild as HTMLElement;
    if (target) {
      if (!disable) {
        instance = tippy(target, {
          content: createContent(text),
          allowHTML: true,
          duration: transitionDuration,
          delay: [delay, 0],
          touch: ['hold', 500],
          offset: fixed ? offset : [6, 24],
          animation: 'fade',
          placement: position,
          followCursor: !fixed,
          plugins: [followCursor]
        });
      }
    } else {
      Logger.error('Tooltip target not found!');
    }
  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
    }
  });

  const createContent = (content: string) => {
    const div = document.createElement('div');
    div.innerText = content;
    div.classList.add(
      'tooltip',
      'rounded-md',
      'py-1',
      'px-2',
      'shadow-md',
      'bg-light',
      'text-dark',
      'dark:bg-gray',
      'dark:text-light',
      'font-code',
      'text-sm'
    );
    return div;
  };

  $: if (text !== (instance?.props.content as Element | undefined)?.textContent) {
    instance?.setContent(createContent(text));
  }
  $: if (!disable) {
    instance?.enable();
  } else {
    instance?.disable();
  }
</script>

<div class="contents h-fit w-fit" data-test-id="tooltip-container" bind:this={container}>
  <slot />
</div>

<style lang="scss">
  :global(.tippy-box[data-animation='fade'][data-state='hidden']) {
    opacity: 0;
    will-change: opacity;
  }
  :global(.tippy-box[data-animation='fade'][data-state='visible']) {
    opacity: 1;
    will-change: opacity;
  }
</style>
