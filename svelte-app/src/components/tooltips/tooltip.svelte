<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte';

  import type { Placement } from '@floating-ui/dom';
  import Inner from '$components/tooltips/inner.svelte';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import Logger from '$lib/logger';
  import { isMobile } from '$lib/responsive';
  import { cubicInOut } from 'svelte/easing';
  import { get } from 'svelte/store';
  import { fly } from 'svelte/transition';

  let {
    children,
    content = undefined,
    duration = BASE_ANIMATION_DURATION,
    placement = 'bottom',
    delay = [0, 0],
    offset = 10,
    followCursor = false,
  }: {
    children: Snippet<[{ id?: string }]>;
    content?: string | Snippet<[{ id?: string }]>;
    duration?: number;
    placement?: Placement;
    delay?: [number, number];
    offset?: number | [number, number];
    followCursor?: boolean;
  } = $props();

  const tooltipId = Math.floor(Math.random() * 100000);

  let timeoutInId: ReturnType<typeof setTimeout> | undefined = $state(undefined),
    timeoutOutId: ReturnType<typeof setTimeout> | undefined = $state(undefined),
    container: HTMLSpanElement | null = $state(null),
    target: HTMLElement | null = $state(null),
    active = $state(false);

  export const id = `tooltip-${tooltipId}`;

  const showTooltip = () => {
    if (!target || !content || get(isMobile)) {
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

  const getActionableTarget = (el: HTMLElement | null) => {
    if (el && getComputedStyle(el)?.display === 'contents') {
      return getActionableTarget(el?.firstElementChild as HTMLElement | null);
    }

    return el;
  };

  const events = [
    ['mouseenter', showTooltip],
    ['mouseleave', hideTooltip],
    ['focusin', showTooltip],
    ['focusout', hideTooltip],
    ['blur', hideTooltip],
  ] as const;

  onMount(() => {
    target = getActionableTarget(container?.firstElementChild as HTMLElement | null);

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
  {@render children({ id })}
</span>

{#if active && target}
  <Inner
    id={tooltipId}
    transition={typeof content === 'string'
      ? (node, args) => fly(node, { ...(args ?? {}), easing: cubicInOut, y: 2 })
      : (node, args) => fly(node, { ...(args ?? {}), easing: cubicInOut, y: 4 })}
    {duration}
    {placement}
    {offset}
    {target}
    {followCursor}
    className={typeof content === 'string'
      ? 'bg-neutral-100/70 backdrop-blur-sm text-sm font-semibold text-dark/70 dark:bg-neutral-500/70 dark:text-light/70 whitespace-nowrap rounded-md'
      : undefined}>
    {#if typeof content === 'string'}
      {content}
    {:else if content}
      {@render content({ id })}
    {/if}
  </Inner>
{/if}
