import type { Document, DocumentHeadings, DocumentTags } from '$types/documents';
import type { SanityAsset, SanityImageObject } from '$types/sanity';

export interface ProjectDocument extends Document {
  _type: 'project';
  author?: {
    _id: string;
    _type: string;
    name: string;
    image: SanityImageObject;
    slug: SanityAsset & { current: string };
  };
  headings: DocumentHeadings[];
  desc?: string;
  images?: SanityImageObject[];
  tags?: DocumentTags[];
  title: string;
  language?: string;
  github?: string;
  links?: {
    _key: string;
    title: string;
    url: string;
  }[];
}
