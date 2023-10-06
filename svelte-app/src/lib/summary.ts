import { derived, writable } from 'svelte/store';

import { isDesktop } from '$lib/helpers/responsive';

import type { DocumentHeadings } from '$types';

const summaryVisible = writable(false),
  summaryContents = writable<DocumentHeadings[] | undefined>(undefined),
  shouldShowSummary = derived(
    [isDesktop, summaryVisible, summaryContents],
    ([isDesktop, summaryVisible, summaryContents]) => {
      return isDesktop && summaryVisible && summaryContents?.length;
    }
  );

export { shouldShowSummary, summaryContents, summaryVisible };
