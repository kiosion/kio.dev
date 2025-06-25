import { browser } from '$app/environment';
import type { Tweened } from 'svelte/motion';
import { writable } from 'svelte/store';

export type CursorTarget = {
  element: HTMLElement | undefined;
  id: string;
  snapDist: number;
  snap: boolean;
  offset: Tweened<[number, number]>;
  size: number;
};

export const BASE_CURSOR_SIZE = 36;
export const BASE_CURSOR_INNER_SIZE = 4;

export const DEFAULT_SNAP_DIST = 52;
export const DEFAULT_NO_SNAP_DIST = 20;

export const BASE_TWEEN_MS = 250;
export const BASE_TWEEN_MS_FAST = 125;

export const activeTarget = writable<CursorTarget | undefined>(undefined);
export const cursorTargets = writable<CursorTarget[]>([]);

export const getFirstPositionedChild = (el: HTMLElement): HTMLElement | undefined => {
  if (!browser) {
    return undefined;
  }

  const firstChild = el.firstElementChild as HTMLElement | null;

  if (!firstChild) {
    return undefined;
  }

  const style = window.getComputedStyle(firstChild);

  if (style.display === 'none' || style.display === 'contents') {
    return getFirstPositionedChild(firstChild);
  }

  return firstChild;
};

export const findDistance = ({ x, y }: { x: number; y: number }, rect: DOMRect) => {
  const hd = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0,
    vd = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;

  return Math.max(hd, vd);
};
