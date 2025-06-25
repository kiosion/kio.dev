import type { HeadingNode } from '$types/documents';
import type { GetPostQueryResult, GetProjectQueryResult } from '$types/sanity';
import { writable } from 'svelte/store';

type SidebarBlockContent = Pick<
  NonNullable<GetPostQueryResult | GetProjectQueryResult>,
  'title' | 'desc' | 'tags' | 'date' | 'views'
> & { estimatedReadingTime: number };

export const sidebarBlock = writable<SidebarBlockContent | undefined>(undefined);

export const sidebarHeadings = writable<HeadingNode[] | undefined>(undefined);
