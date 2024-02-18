<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import Logger from '$lib/logger';
  import { createTooltip, destroyTooltip } from '$lib/tooltips';

  import type { Tooltip } from '$lib/tooltips';

  export let text: Tooltip['content'],
    duration: Tooltip['duration'] = 200,
    delay = 150,
    position: Tooltip['placement'] = 'bottom',
    fixed: Tooltip['followCursor'] = true,
    offset: Tooltip['offset'] = [0, 12];

  let tooltipId = Math.floor(Math.random() * 100000),
    timeoutId: ReturnType<typeof setTimeout>,
    container: HTMLSpanElement,
    target: HTMLElement | null;

  const showTooltip = () => {
    if (!target || !text?.trim()) {
      return;
    }

    clearTimeout(timeoutId);

    timeoutId = setTimeout(
      () => {
        createTooltip({
          id: tooltipId,
          content: text,
          duration,
          placement: position,
          followCursor: !fixed,
          offset,
          target: target as HTMLElement
        });
      },
      Math.max(0, delay - 50)
    );
  };

  const hideTooltip = () => {
    clearTimeout(timeoutId);
    destroyTooltip(tooltipId);
  };

  const getActionableTarget = (el: HTMLElement | null): HTMLElement | null => {
    if (el && getComputedStyle(el)?.display === 'contents') {
      return getActionableTarget(el?.firstChild as HTMLElement | null);
    }

    return el;
  };

  onMount(() => {
    target = getActionableTarget(container?.firstChild as HTMLElement | null);

    if (!target) {
      Logger.error('Tooltip target not found!');
      return;
    }

    target.addEventListener('mouseenter', showTooltip);
    target.addEventListener('mouseleave', hideTooltip);
    target.addEventListener('focusin', showTooltip);
    target.addEventListener('focusout', hideTooltip);
    target.addEventListener('blur', hideTooltip);
    target.addEventListener('click', hideTooltip);
  });

  onDestroy(() => {
    hideTooltip();

    if (!target) {
      return;
    }

    target.removeEventListener('mouseenter', showTooltip);
    target.removeEventListener('mouseleave', hideTooltip);
    target.removeEventListener('focusin', showTooltip);
    target.removeEventListener('focusout', hideTooltip);
    target.removeEventListener('blur', hideTooltip);
    target.removeEventListener('click', hideTooltip);
  });
</script>

<span bind:this={container} class="contents" data-test-id="tooltip-container">
  <slot />
</span>
