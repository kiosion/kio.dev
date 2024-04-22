<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { get } from 'svelte/store';

  import { browser } from '$app/environment';
  import Logger from '$lib/logger';
  import { isMobile } from '$lib/responsive';
  import { createTooltip, destroyTooltip, updateTooltip } from '$lib/tooltips';

  import type { Tooltip } from '$lib/tooltips';

  export let text: Tooltip['content'],
    duration: Tooltip['duration'] = 150,
    inDelay = 50,
    outDelay = 100,
    position: Tooltip['placement'] = 'bottom',
    fixed: Tooltip['followCursor'] = true,
    offset: Tooltip['offset'] = [0, 12];

  let tooltipId = Math.floor(Math.random() * 100000),
    timeoutId: ReturnType<typeof setTimeout>,
    container: HTMLSpanElement,
    target: HTMLElement | null;

  export const id = `tooltip-${tooltipId}`;

  const showTooltip = () => {
    if (!target || !text?.trim() || get(isMobile)) {
      return;
    }

    clearTimeout(timeoutId);

    const opts = {
      id: tooltipId,
      content: text,
      duration,
      placement: position,
      followCursor: !fixed,
      offset,
      target: target as HTMLElement,
      delay: outDelay
    };

    if (inDelay > 0) {
      timeoutId = setTimeout(() => createTooltip(opts), inDelay);
    } else {
      createTooltip(opts);
    }
  };

  const hideTooltip = (e?: Event) => {
    if (e?.type === 'mouseleave' && target?.matches(':focus-visible')) {
      return;
    }

    destroyTooltip(tooltipId);
    clearTimeout(timeoutId);
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
  });

  $: tooltipId && text?.trim() && browser && updateTooltip(tooltipId, { content: text });
</script>

<span bind:this={container} class="contents" data-test-id="tooltip-container">
  <slot {id} />
</span>
