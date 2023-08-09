import type { Document, DocumentHeadings, DocumentTags } from '$types/documents';
import type { SanityAsset, SanityImageObject } from '$types/sanity';

export interface ProjectDocument extends Document {
  author?: {
    _id: string;
    _type: string;
    name: string;
    image: SanityImageObject;
    slug: SanityAsset & { current: string };
  };
  headings: DocumentHeadings[];
  external: boolean;
  externalAuthor?: string;
  externalUrl?: string;
  desc?: string;
  image?: SanityImageObject;
  tags?: DocumentTags[];
  title: string;
  language?: string;
  externalLinks?: {
    _key: string;
    title: string;
    url: string;
  }[];
}
