import { writable } from 'svelte/store';

type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export type Tooltip = {
  id: number;
  content: string;
  duration: number;
  placement: Placement;
  followCursor: boolean;
  target: HTMLElement;
  offset: [number, number];
};

const tooltips = writable<Map<number, Tooltip>>(new Map());

const createTooltip = (data: Tooltip) => {
  tooltips.update((t) => {
    t.set(data.id, data);
    return t;
  });
  return data.id;
};

const destroyTooltip = (id: number) => {
  tooltips.update((t) => {
    t.delete(id);
    return t;
  });
};

export { createTooltip, destroyTooltip, tooltips };
