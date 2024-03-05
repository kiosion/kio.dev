import { writable } from 'svelte/store';

import { browser } from '$app/environment';

import type { Tweened } from 'svelte/motion';

export type CursorTarget = {
  element: HTMLElement | undefined;
  id: string;
  snapDist: number;
  snap: boolean;
  offset: Tweened<[number, number]>;
  size: number;
};

export const DEFAULT_SNAP_DIST = 52;
export const DEFAULT_NO_SNAP_DIST = 20;

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
