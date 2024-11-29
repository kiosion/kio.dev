<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { cubicInOut } from 'svelte/easing';
  import { get } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import Logger from '$lib/logger';
  import { isMobile } from '$lib/responsive';

  import Inner from '$components/tooltips/inner.svelte';

  import type { Placement } from '@floating-ui/dom';
  import type { Snippet } from 'svelte';

  let {
    children,
    content = undefined,
    duration = BASE_ANIMATION_DURATION,
    placement = 'bottom',
    delay = [0, 0],
    offset = 10,
    showArrow = false,
    followCursor = false
  }: {
    children?: Snippet<[{ id: string }]>;
    content?: string | Snippet<[{ id: string }]>;
    duration?: number;
    placement?: Placement;
    delay?: [number, number];
    offset?: number;
    showArrow?: boolean;
    followCursor?: boolean;
  } = $props();

  const tooltipId = Math.floor(Math.random() * 100000);

  let timeoutInId: ReturnType<typeof setTimeout>,
    timeoutOutId: ReturnType<typeof setTimeout>,
    container: HTMLSpanElement,
    target = $state<Element | null>(null),
    active = $state(false);

  export const id = `tooltip-${tooltipId}`;

  const showTooltip = () => {
    if (
      !target ||
      (typeof content !== 'string' && typeof content !== 'function') ||
      get(isMobile)
    ) {
      return;
    }

    clearTimeout(timeoutInId);
    clearTimeout(timeoutOutId);

    if (delay[0] > 0) {
      timeoutInId = setTimeout(() => (active = true), delay[0]);
    } else {
      active = true;
    }
  };

  const hideTooltip = (e?: Event) => {
    if (e?.type === 'mouseleave' && target?.matches(':focus-visible')) {
      return;
    }

    clearTimeout(timeoutInId);

    if (delay[1] > 0) {
      timeoutOutId = setTimeout(() => (active = false), delay[1]);
    } else {
      active = false;
    }
  };

  const getActionableTarget = <E extends Element>(el: E | null): E | null => {
    if (!el) {
      return null;
    }

    try {
      if (getComputedStyle(el)?.display === 'contents') {
        return getActionableTarget(el?.firstElementChild as E | null);
      }
    } catch (e) {
      Logger.error('Finding tooltip target', e, el);
    }

    return el;
  };

  const events = [
    ['mouseenter', showTooltip],
    ['mouseleave', hideTooltip],
    ['focusin', showTooltip],
    ['focusout', hideTooltip],
    ['blur', hideTooltip]
  ] as const;

  onMount(() => {
    target = getActionableTarget(container?.firstElementChild);

    if (!target) {
      Logger.error('tooltip target not found for', { container });
      return;
    }

    events.forEach(([event, handler]) => target!.addEventListener(event, handler));
  });

  onDestroy(() => {
    hideTooltip();

    if (!target) {
      return;
    }

    events.forEach(([event, handler]) => target!.removeEventListener(event, handler));
  });
</script>

<span bind:this={container} class="contents" data-test-id="tooltip-container">
  {@render children?.({ id })}
</span>

{#if active && target}
  <Inner
    id={tooltipId}
    transition={content
      ? (node, args) => fade(node, { ...(args ?? {}), easing: cubicInOut })
      : (node, args) => fly(node, { ...(args ?? {}), easing: cubicInOut, x: 4 })}
    {duration}
    {placement}
    {offset}
    {target}
    {showArrow}
    {followCursor}
    className={content &&
      'bg-neutral-600 font-mono text-xs text-light dark:bg-neutral-100 dark:text-dark whitespace-nowrap rounded-md'}
  >
    {#if typeof content === 'string'}
      {content}
    {:else}
      {@render content?.({ id })}
    {/if}
  </Inner>
{/if}
