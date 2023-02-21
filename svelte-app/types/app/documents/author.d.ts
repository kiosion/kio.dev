import type {
  SanityImageObject,
  InputValue,
  SanityAsset,
  PTBlock,
  ArbitraryTypedObject,
  PortableTextBlock
} from '$types/sanity';

import type { Document } from '$types/documents';

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
  at: string;
  bio: (PortableTextBlock | ArbitraryTypedObject)[];
  now: (PortableTextBlock | ArbitraryTypedObject)[];
  name: string;
  fullname: string;
  at: string;
  location: string;
  image: SanityImageObject;
  timeline: AuthorTimelineItem[];
  contact: (PortableTextBlock | ArbitraryTypedObject)[];
}
