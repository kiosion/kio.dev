import { writable } from 'svelte/store';

import { browser } from '$app/environment';

export type CursorTarget = {
  element: HTMLElement | undefined;
  id: string;
  snapDistance: number;
  snapFull: boolean;
  sizeOffset: number;
};

export const DEFAULT_SNAP_DIST = 52;
export const DEFAULT_NO_SNAP_DIST = 20;

export const CURSOR_TARGET_ATTR = 'data-cursor-target';
export const CURSOR_TARGET_ID_ATTR = 'data-cursor-target-id';
export const CURSOR_TARGET_DIST_ATTR = 'data-cursor-target-dist';

export const activeTarget = writable<CursorTarget | undefined>(undefined);
export const cursorTargets = writable<CursorTarget[]>([]);

export const getFirstPositionedChild = (el: HTMLElement): HTMLElement | undefined => {
  if (!browser) {
    return undefined;
  }

  const firstChild = el.firstElementChild as HTMLElement;

  if (!firstChild) {
    return undefined;
  }

  const style = window.getComputedStyle(firstChild);

  if (style.display === 'none' || style.display === 'contents') {
    return getFirstPositionedChild(firstChild);
  }

  return firstChild;
};
