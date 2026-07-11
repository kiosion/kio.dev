import { cubicIn, cubicOut } from 'svelte/easing';
import { crossfade, type TransitionConfig } from 'svelte/transition';

export const PAGE_OUT_DURATION = 150;
export const PAGE_IN_DURATION = 300;

/** Incoming content (and the heading/body morph) waits until the fade-out ends. */
export const PAGE_IN_DELAY = PAGE_OUT_DURATION - 50;

/** How far (px) incoming content travels up as it fades in. */
const RISE = 8;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Per-row enter/exit durations for the in-place list reflow (tag filtering). */
const LIST_ENTER_DURATION = 260;
const LIST_EXIT_DURATION = 200;

/**
 * How long an unmatched morph element stays put while whatever encloses it
 * animates away.
 */
const RIDE_DURATION = Math.max(PAGE_OUT_DURATION, LIST_EXIT_DURATION);

/**
 * Fade + slide-up for incoming page content. Decelerating ease (quintOut) so it
 * settles into place. Delayed until the outgoing fade is essentially done.
 */
export function pageIn(
  _node: Element,
  {
    duration = PAGE_IN_DURATION,
    delay = PAGE_IN_DELAY,
  }: { duration?: number; delay?: number } = {},
): TransitionConfig {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  return {
    duration,
    delay,
    easing: cubicOut,
    css: (t) => `opacity: ${t}; transform: translateY(${(1 - t) * RISE}px);`,
  };
}

/**
 * Fade + slide-DOWN for outgoing page content — the mirror of pageIn's slide-up,
 * so content sinks away as it leaves. Accelerating ease (cubicIn). Same
 * `(1 - t) * RISE` offset as pageIn, but since `t` runs 1-to-0 on the way out it
 * travels downward instead of up.
 */
export function pageOut(
  _node: Element,
  { duration = PAGE_OUT_DURATION }: { duration?: number } = {},
): TransitionConfig {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  return {
    duration,
    easing: cubicIn,
    css: (t) => `opacity: ${t}; transform: translateY(${(1 - t) * RISE}px);`,
  };
}

/**
 * An unmatched / non-morphing element rides whatever encloses it instead of
 * transitioning on its own: on the way out it stays put and on
 * the way in it appears instantly.
 */
const ride = (intro: boolean): TransitionConfig =>
  intro || prefersReducedMotion()
    ? { duration: 0 }
    : { duration: RIDE_DURATION, css: () => '' };

/**
 * Shared-element morph between a post-list card and the post page hero.
 */
export const [send, receive] = crossfade({
  duration: () => (prefersReducedMotion() ? 0 : PAGE_IN_DURATION),
  delay: 50,
  easing: cubicOut,
  fallback: (_node, _params, intro) => ride(intro),
});

/**
 * Collapse + fade for a single row entering/leaving the list in place.
 * Animates the box model to zero so neighbours flow into/out of the freed
 * space through normal layout.
 */
function collapseFade(
  node: Element,
  { duration, easing }: { duration: number; easing: (t: number) => number },
): TransitionConfig {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  const style = getComputedStyle(node);
  const height = parseFloat(style.height);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);
  const marginTop = parseFloat(style.marginTop);
  const marginBottom = parseFloat(style.marginBottom);
  const borderTop = parseFloat(style.borderTopWidth);
  const borderBottom = parseFloat(style.borderBottomWidth);
  return {
    duration,
    easing,
    css: (t) =>
      'overflow: hidden;' +
      `opacity: ${t};` +
      `height: ${t * height}px;` +
      `padding-top: ${t * paddingTop}px;` +
      `padding-bottom: ${t * paddingBottom}px;` +
      `margin-top: ${t * marginTop}px;` +
      `margin-bottom: ${t * marginBottom}px;` +
      `border-top-width: ${t * borderTop}px;` +
      `border-bottom-width: ${t * borderBottom}px;`,
  };
}

/** A list row appearing in place: grow + fade in, decelerating into position. */
export const listEnter = (node: Element): TransitionConfig =>
  collapseFade(node, { duration: LIST_ENTER_DURATION, easing: cubicOut });

/** A list row leaving in place: collapse + fade out, accelerating away. */
export const listExit = (node: Element): TransitionConfig =>
  collapseFade(node, { duration: LIST_EXIT_DURATION, easing: cubicIn });
