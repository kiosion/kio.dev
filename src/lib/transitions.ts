import { cubicIn, cubicOut, quintOut } from 'svelte/easing';
import { crossfade, type TransitionConfig } from 'svelte/transition';

/**
 * Outgoing content fades over this; incoming starts ~as it finishes, so the two
 * never overlap in place (which is what made the old crossfade look like it
 * "clipped"). Total runtime ≈ OUT + IN - the small handoff overlap.
 */
export const PAGE_OUT_DURATION = 150;
export const PAGE_IN_DURATION = 300;

/** Incoming content (and the heading/body morph) waits until the fade-out ends. */
export const PAGE_IN_DELAY = PAGE_OUT_DURATION - 50;

/** How far (px) incoming content travels up as it fades in. */
const RISE = 8;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Whether the in-flight navigation also swaps the keyed page wrapper (a
 * cross-group nav like list<->post), versus an in-place update like toggling a
 * tag filter — set from the layout's `beforeNavigate`. When it's an in-place
 * update there's no page fade for an unmatched morph element to ride, so `ride`
 * must remove it instantly; otherwise the outgoing card lingers 150ms beside the
 * instantly-added new one and reads as a flicker. Defaults to `false` (no fade).
 */
let pageWrapperTransitioning = false;

export function setPageWrapperTransitioning(value: boolean) {
  pageWrapperTransitioning = value;
}

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
 * `(1 - t) * RISE` offset as pageIn, but since `t` runs 1→0 on the way out it
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
 * An unmatched / non-morphing element (a card that isn't the one being opened,
 * or a hero with no counterpart) rides the page fade instead of transitioning on
 * its own: it stays put on the way out (the wrapper's fade carries it) and
 * appears instantly on the way in. No independent fade, no per-element pinning.
 */
const ride = (intro: boolean): TransitionConfig =>
  intro || prefersReducedMotion() || !pageWrapperTransitioning
    ? { duration: 0 }
    : { duration: PAGE_OUT_DURATION, css: () => '' };

/**
 * Shared-element morph between a post-list card and the post page hero. Each
 * direction uses its own key namespace (see the components) so a card's `send`
 * only ever matches the hero's `receive`, never another card. Unmatched elements
 * fall through to `ride`, i.e. the page fade.
 */
export const [send, receive] = crossfade({
  duration: () => (prefersReducedMotion() ? 0 : PAGE_IN_DURATION),
  delay: 50,
  easing: cubicOut,
  fallback: (_node, _params, intro) => ride(intro),
});
