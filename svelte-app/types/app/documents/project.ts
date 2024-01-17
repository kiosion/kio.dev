import type { Document, DocumentHeadings, DocumentTags } from '$types/documents';
import type { SanityImageObject } from '$types/sanity';

export interface ProjectDocument extends Document {
  _type: 'project';
  headings: DocumentHeadings[];
  desc?: string;
  images?: SanityImageObject[];
  tags?: DocumentTags[];
  title: string;
  github?: string;
  githubStars?: number;
  githubWatchers?: number;
  links?: {
    _key: string;
    title: string;
    url: string;
  }[];
}
