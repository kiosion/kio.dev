import { useMediaQuery } from 'svelte-breakpoints';
import { DEFAULT_DESKTOP_BREAKPOINT } from '$lib/consts';
import { readable } from 'svelte/store';

export const isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT);

export const isMobile = readable(false, (set) => {
  const unubscribe = isDesktop.subscribe((value) => {
    set(!value);
  });

  return unubscribe;
});
