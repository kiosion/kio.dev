import type { Document, DocumentTags } from '$types/documents';
import type { SanityAsset, SanityImageObject } from '$types/sanity';

export interface PostDocument extends Document {
  author?: Pick<SanityAsset, '_id' | '_type'> & {
    name: string;
    image: SanityImageObject;
    slug: Pick<SanityAsset, '_id'> & {
      current: string;
    };
  };
  desc?: string;
  tags?: DocumentTags[];
  title: string;
}
