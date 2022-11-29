import type { Document, DocumentTags } from '$types/documents';
import type { SanityImageObject, SanityAsset } from '$types/sanity';

export interface ProjectDocument extends Document {
  author?: {
    _id: string;
    _type: string;
    name: string;
    image: SanityImageObject;
    slug: SanityAsset & { current: string };
  };
  desc?: string;
  image?: SanityImageObject;
  tags?: DocumentTags[];
  title: string;
  external?: boolean;
  externalUrl?: string;
  externalLinks?: {
    title: string;
    url: string;
  }[];
}
