import { derived, writable } from 'svelte/store';

import { page } from '$app/stores';
import { isDesktop } from '$lib/helpers/responsive';

import type { DocumentHeadings } from '$types';

const recursiveFlattenHeadings = (headings: DocumentHeadings[]): DocumentHeadings[] => {
  return headings.flatMap((heading) => {
    return heading.children?.length
      ? [heading, ...recursiveFlattenHeadings(heading.children)]
      : [heading];
  });
};

let previousFirstVisibleHeading: string | undefined;

const summaryVisible = writable(false),
  summaryContents = writable<DocumentHeadings[] | undefined>(undefined),
  headingElements = writable<Set<HTMLElement>>(new Set()),
  visibleHeadings = writable<Set<string>>(new Set()),
  firstVisibleHeading = derived(
    [visibleHeadings, summaryContents, page],
    ([_visibleHeadings, _summaryContents, _page]) => {
      if (!_summaryContents?.length || !_visibleHeadings?.size) {
        return previousFirstVisibleHeading;
      }

      const flatSummaryContents = recursiveFlattenHeadings(_summaryContents),
        pageHash = _page.url.hash,
        pageHashHeading = flatSummaryContents.find((heading) => {
          return heading.key === pageHash.slice(1);
        });

      let firstVisibleHeading = flatSummaryContents.find((heading) =>
        _visibleHeadings.has(heading.key)
      );

      if (pageHashHeading && _visibleHeadings.has(pageHashHeading?.key)) {
        const pageHashHeadingIndex = flatSummaryContents.indexOf(pageHashHeading),
          firstVisibleHeadingIndex = firstVisibleHeading
            ? flatSummaryContents.indexOf(firstVisibleHeading)
            : -1;
        if (pageHashHeadingIndex > firstVisibleHeadingIndex) {
          firstVisibleHeading = pageHashHeading;
        }
      }

      firstVisibleHeading?.key && (previousFirstVisibleHeading = firstVisibleHeading.key);
      return firstVisibleHeading?.key ?? previousFirstVisibleHeading;
    }
  ),
  summaryOffset = writable(0),
  shouldShowSummary = derived(
    [isDesktop, summaryVisible, summaryContents],
    ([isDesktop, summaryVisible, summaryContents]) => {
      return isDesktop && summaryVisible && summaryContents?.length;
    }
  );

export {
  firstVisibleHeading,
  headingElements,
  shouldShowSummary,
  summaryContents,
  summaryOffset,
  summaryVisible,
  visibleHeadings
};
