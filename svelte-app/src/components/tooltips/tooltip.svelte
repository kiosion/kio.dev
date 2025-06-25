<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import type { Placement } from '@floating-ui/dom';
  import Inner from '$components/tooltips/inner.svelte';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import Logger from '$lib/logger';
  import { isMobile } from '$lib/responsive';
  import { cubicInOut } from 'svelte/easing';
  import { get } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';

  export let content: string | undefined = undefined,
    duration: number = BASE_ANIMATION_DURATION,
    placement: Placement = 'bottom',
    delay: [number, number] = [0, 0],
    offset: number = 10,
    showArrow = false,
    followCursor = false;

  const tooltipId = Math.floor(Math.random() * 100000);

  let timeoutInId: ReturnType<typeof setTimeout>,
    timeoutOutId: ReturnType<typeof setTimeout>,
    container: HTMLSpanElement,
    target: HTMLElement | null,
    active = false;

  export const id = `tooltip-${tooltipId}`;

  const showTooltip = () => {
    if (!target || (!content && !$$slots?.content) || get(isMobile)) {
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

  const getActionableTarget = (el: HTMLElement | null): HTMLElement | null => {
    if (el && getComputedStyle(el)?.display === 'contents') {
      return getActionableTarget(el?.firstChild as HTMLElement | null);
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
    target = getActionableTarget(container?.firstChild as HTMLElement | null);

    if (!target) {
      Logger.error('Tooltip target not found!');
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
  <slot {id} />
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
    {#if content}
      {content}
    {:else}
      <slot name="content" {id} />
    {/if}
  </Inner>
{/if}
