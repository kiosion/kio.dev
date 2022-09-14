import { writable } from 'svelte/store';

interface CursorStore {
  isHovered: boolean;
  isPressed: boolean;
  isDragging: boolean;
  currentTarget: HTMLElement | null;
}

const cursor = writable<CursorStore>({
  isHovered: false,
  isPressed: false,
  isDragging: false,
  currentTarget: null
});

export default cursor;
