import { cubicIn, quintOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/**
 * Outgoing content fades over this; incoming starts ~as it finishes, so the two
 * never overlap in place (which is what made the old crossfade look like it
 * "clipped"). Total runtime ≈ OUT + IN - the small handoff overlap.
 */
export const PAGE_OUT_DURATION = 180;
export const PAGE_IN_DURATION = 360;

/** How far (px) incoming content travels up as it fades in. */
const RISE = 4;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade + slide-up for incoming page content. Decelerating ease (quintOut) so it
 * settles into place. Delayed until the outgoing fade is essentially done.
 */
export function pageIn(
  _node: Element,
  {
    duration = PAGE_IN_DURATION,
    delay = PAGE_OUT_DURATION - 40,
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

/** Quick fade-out for outgoing page content; accelerating ease (cubicIn). */
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
    css: (t) => `opacity: ${t};`,
  };
}
