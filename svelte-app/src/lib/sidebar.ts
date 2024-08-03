import { writable } from 'svelte/store';

import type { PostDocument, ProjectDocument } from '$types';

type SidebarBlockContent = Pick<
  PostDocument | ProjectDocument,
  'title' | 'desc' | 'tags' | 'date' | 'estimatedReadingTime' | 'views'
  // eslint-disable-next-line @typescript-eslint/ban-types
> & {};

export const sidebarBlock = writable<SidebarBlockContent | undefined>(undefined);
