import type { PTBlock, SanityAsset } from '$types/sanity';

export interface Document extends SanityAsset {
  slug: Pick<SanityAsset, '_id'> & {
    current: string;
  };
  body: PTBlock[];
  date: string;
  views?: number;
  numberOfCharacters: number;
  estimatedWordCount: number;
  estimatedReadingTime: number;
}

export interface DocumentTags extends SanityAsset {
  slug: Pick<SanityAsset, '_id'> & {
    current: string;
  };
  title: string;
}

export interface DocumentHeadings {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  typeLevel: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  key: string;
  parent: string | null;
  children?: DocumentHeadings[];
}

export type ProjectImage = {
  crop: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  };
  placeholder?: string;
  asset: Promise<string | undefined>;
};

export type { AuthorDocument, AuthorTimelineItem } from '$types/documents/author';
export type { PostDocument } from '$types/documents/post';
export type { ProjectDocument } from '$types/documents/project';
