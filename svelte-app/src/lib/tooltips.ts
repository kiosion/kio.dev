import { writable } from 'svelte/store';

type BasicPlacement = 'top' | 'bottom' | 'left' | 'right';

type Placement = BasicPlacement | `${BasicPlacement}-start` | `${BasicPlacement}-end`;

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

const updateTooltip = (
  id: number,
  data: Partial<Exclude<Tooltip, 'id' | 'target' | 'duration'>>
) => {
  tooltips.update((t) => {
    const tooltip = t.get(id);
    if (tooltip) {
      t.set(id, { ...tooltip, ...data });
    }
    return t;
  });
};

const destroyTooltip = (id: number) => {
  tooltips.update((t) => {
    t.delete(id);
    return t;
  });
};

export { createTooltip, destroyTooltip, tooltips, updateTooltip };
