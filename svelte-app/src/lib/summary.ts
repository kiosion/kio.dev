import { derived, writable } from 'svelte/store';

import { page } from '$app/stores';
import { isDesktop } from '$lib/helpers/responsive';

import type { Page } from '@sveltejs/kit';
import type { DocumentHeadings } from '$types';

const recursiveFlattenHeadings = (headings: DocumentHeadings[]): DocumentHeadings[] => {
  return headings.flatMap((heading) => {
    return heading.children?.length
      ? [heading, ...recursiveFlattenHeadings(heading.children)]
      : [heading];
  });
};

let previousFirstVisibleHeading: string | undefined;

const findFirstVisibleHeading = ([visibleHeadings, summaryContents, page]: [
  Set<string>,
  DocumentHeadings[] | undefined,
  Page<Record<string, string>>
]) => {
  if (!summaryContents?.length || !visibleHeadings?.size) {
    return previousFirstVisibleHeading;
  }

  const flatSummaryContents = recursiveFlattenHeadings(summaryContents),
    pageHash = page.url.hash,
    pageHashHeading = flatSummaryContents.find((heading) => {
      return heading.key === pageHash.slice(1);
    });

  let firstVisibleHeading = flatSummaryContents.find((heading) => {
    return visibleHeadings.has(heading.key);
  });

  if (pageHashHeading && visibleHeadings.has(pageHashHeading?.key)) {
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
};

const summaryVisible = writable(false),
  summaryContents = writable<DocumentHeadings[] | undefined>(undefined),
  visibleHeadings = writable<Set<string>>(new Set()),
  firstVisibleHeading = derived(
    [visibleHeadings, summaryContents, page],
    findFirstVisibleHeading
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
  shouldShowSummary,
  summaryContents,
  summaryOffset,
  summaryVisible,
  visibleHeadings
};