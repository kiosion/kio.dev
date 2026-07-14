// quintOut ≈ cubic-bezier(0.23, 1, 0.32, 1) — the same curve as --ease-out in
// tailwind.css, so Svelte-driven and CSS-driven motion share one personality.
import { quintOut } from 'svelte/easing';
import { crossfade, type TransitionConfig } from 'svelte/transition';

export const PAGE_OUT_DURATION = 120;
export const PAGE_IN_DURATION = 250;

/** Incoming content (and the heading/body morph) waits until the fade-out ends. */
export const PAGE_IN_DELAY = PAGE_OUT_DURATION - 40;

/** How far (px) incoming content travels up as it fades in. */
const RISE = 6;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * How long an unmatched morph element stays put while whatever encloses it
 * (the page or list fade-out) animates away.
 */
const RIDE_DURATION = PAGE_OUT_DURATION;

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
    easing: quintOut,
    css: (t) => `opacity: ${t}; transform: translateY(${(1 - t) * RISE}px);`,
  };
}

/**
 * Fade + slide-DOWN for outgoing page content — the mirror of pageIn's slide-up,
 * so content sinks away as it leaves. Decelerating ease (quintOut), matching pageIn. Same
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
    easing: quintOut,
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
 * Shared-element morph between a post-list card and the post page header.
 */
export const [send, receive] = crossfade({
  duration: () => (prefersReducedMotion() ? 0 : PAGE_IN_DURATION),
  delay: 50,
  easing: quintOut,
  fallback: (_node, _params, intro) => ride(intro),
});

/**
 * A breadcrumb segment entering/leaving: fade + width-collapse in place, so
 * neighbouring segments slide smoothly instead of jumping when one swaps.
 */
export function crumbFade(node: Element): TransitionConfig {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  const width = node.getBoundingClientRect().width;
  return {
    duration: 160,
    easing: quintOut,
    css: (t) => `opacity: ${t}; max-width: ${t * width}px; overflow: hidden;`,
  };
}
