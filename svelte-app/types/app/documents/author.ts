import type { Document } from '$types/documents';
import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  SanityAsset,
  SanityImageObject
} from '$types/sanity';

export type AuthorTimelineItem = SanityAsset & {
  title: string;
  subtitle?: string;
  body?: (PortableTextBlock | ArbitraryTypedObject)[];
  range: {
    start: string;
    end?: string;
  };
  skills?: (SanityAsset & {
    slug: SanityAsset & { current: string };
    title: string;
  })[];
  hovered?: boolean;
};

export interface AuthorDocument extends Omit<Document, 'slug' | 'date'> {
  bio: (PortableTextBlock | ArbitraryTypedObject)[];
  name: string;
  image: SanityImageObject;
  timeline: AuthorTimelineItem[];
  contact: (PortableTextBlock | ArbitraryTypedObject)[];
}
