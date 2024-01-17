<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import Logger from '$lib/logger';

  import tippy, { followCursor } from 'tippy.js';

  import type { Instance, Placement } from 'tippy.js';

  export let text = '',
    position: Placement = 'bottom',
    transitionDuration = 200,
    delay = 1400,
    disable = false,
    offset = [0, 12] as [number, number],
    fixed = false;

  let container: HTMLSpanElement, instance: Instance;

  onMount(() => {
    let target = container?.firstChild as HTMLElement | null;

    if (target && window?.getComputedStyle(target).display === 'contents') {
      target = target?.firstChild as HTMLElement | null;
    }

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

  onDestroy(() => instance?.destroy?.());

  const createContent = (content: string) => {
    const div = document.createElement('div');
    div.innerText = content;
    div.classList.add(
      'tooltip',
      'rounded-sm',
      'py-1',
      'px-2',
      'bg-black',
      'text-light',
      'dark:bg-light',
      'dark:text-dark',
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

<span class="contents h-fit w-fit" data-test-id="tooltip-container" bind:this={container}>
  <slot />
</span>

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
