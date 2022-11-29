import type { SvelteComponent } from 'svelte';

// Misc
export type PixelIcon = SvelteComponent | string | undefined;

export interface MenuStateOpt {
  disabled?: boolean;
  icon?: string;
  text?: string;
  action?: () => void | Promise<void> | undefined;
}

export interface MenuState {
  open: boolean;
  pos: {
    x: number;
    y: number;
  };
  target: HTMLElement;
  opts: MenuStateOpt[];
}

// Some internal Sveltekit types
export interface RouteFetch {
  (info: RequestInfo, init?: RequestInit): Promise<Response>;
}

export type Subscriber<T> = (value: T) => void;
export type Unsubscriber = () => void;
export type Updater<T> = (value: T) => T;
export type Invalidator<T> = (value?: T) => void;

// Re-exports
export * from '$types/documents';
export * from '$types/sanity';
export * from '$types/config';
export * from '$types/api';
