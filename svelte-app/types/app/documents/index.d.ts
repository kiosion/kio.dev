import type { SanityAsset } from '$types/sanity';

export interface Document extends SanityAsset {
  slug: Pick<SanityAsset, '_id'> & {
    current: string;
  };
  body: PTBlock[];
  date: string;
}

export interface DocumentTags extends SanityAsset {
  slug: Pick<SanityAsset, '_id'> & {
    current: string;
  };
  title: string;
}

export type { ProjectDocument } from '$types/documents/project';
export type { PostDocument } from '$types/documents/post';
export type {
  AuthorDocument,
  AuthorTimelineItem
} from '$types/documents/author';
export type { Comment } from '$types/documents/comment';
