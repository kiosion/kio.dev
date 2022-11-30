import type { Document, DocumentTags } from '$types/documents';
import type { SanityImageObject, SanityAsset } from '$types/sanity';

type IsExternal =
  | {
      external: true;
      externalUrl: string;
      externalAuthor: string;
    }
  | {
      external: false;
      externalUrl: never;
      externalAuthor: never;
    };

export interface ProjectDocument extends Document, IsExternal {
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
  externalLinks?: {
    _key: string;
    title: string;
    url: string;
  }[];
}
