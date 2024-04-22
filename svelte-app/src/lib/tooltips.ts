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
  delay: number;
};

const tooltips = writable<Tooltip[]>([]);

const createTooltip = (data: Tooltip) => {
  tooltips.update((t) => {
    const existing = t.findIndex(
      (tooltip) => tooltip.id === data.id || tooltip.target === data.target
    );
    if (existing !== -1) {
      t.splice(existing, 1);
    }
    t.push(data);
    return t;
  });
  return data.id;
};

const updateTooltip = (
  id: number,
  data: Partial<Exclude<Tooltip, 'id' | 'target' | 'duration'>>
) => {
  tooltips.update((t) => {
    const existing = t.findIndex((tooltip) => tooltip.id === id);
    if (existing !== -1) {
      t[existing] = { ...t[existing], ...data };
    }
    return t;
  });
};

const destroyTooltip = (id: number) => {
  tooltips.update((t) => {
    const filtered = [];

    for (let i = 0; i < t.length; ++i) {
      if (t[i].id !== id) {
        filtered.push(t[i]);
      }
    }

    return filtered;
  });
};

export { createTooltip, destroyTooltip, tooltips, updateTooltip };
