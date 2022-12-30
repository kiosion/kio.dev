<script lang="ts">
  import type { Placement } from '@popperjs/core';
  import { onMount, onDestroy } from 'svelte';
  import Logger from '$lib/logger';
  import tippy, { followCursor, type Instance } from 'tippy.js';
  import Features from '$stores/features';

  export let text = '',
    position: Placement = 'bottom',
    transitionDuration = 200,
    delay = 800,
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
      'bg-gray-200',
      'text-gray-800',
      'dark:bg-gray-900',
      'dark:text-gray-200',
      'font-code',
      'text-sm'
    );
    return div;
  };

  $: useTooltips = Features.can('see tooltips');
  $: if ($useTooltips === false) {
    disable = true;
  }
  $: if (
    text !== (instance?.props.content as Element | undefined)?.textContent
  ) {
    instance?.setContent(createContent(text));
  }
  $: if ($useTooltips === false) {
    instance?.disable();
  } else {
    instance?.enable();
  }
</script>

<div
  class="contents w-fit h-fit"
  data-test-id="tooltip-container"
  bind:this={container}
>
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
