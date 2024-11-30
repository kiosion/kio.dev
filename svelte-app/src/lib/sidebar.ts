/* eslint-disable func-call-spacing */
import { writable } from 'svelte/store';

import type { PostDocument, ProjectDocument } from '$types';

type SidebarBlockContent = Pick<
  PostDocument | ProjectDocument,
  'title' | 'desc' | 'tags' | 'date' | 'estimatedReadingTime' | 'views'
> & {};

export const sidebarBlock = writable<SidebarBlockContent | undefined>(undefined);

export const sidebarHeadings = writable<
  (PostDocument | ProjectDocument)['headings'] | undefined
>(undefined);
