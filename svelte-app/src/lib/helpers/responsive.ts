import { derived } from 'svelte/store';

import { useMediaQuery } from 'svelte-breakpoints';

import { DEFAULT_DESKTOP_BREAKPOINT, DEFAULT_TABLET_BREAKPOINT } from '$lib/consts';

export const isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT),
  isTablet = useMediaQuery(DEFAULT_TABLET_BREAKPOINT),
  isMobile = derived(
    [isDesktop, isTablet],
    ([isDesktop, isTablet]) => !isDesktop && !isTablet
  );
