import type {
  SanityImageObject,
  InputValue,
  SanityAsset,
  PTBlock
} from '$types/sanity';
import type {
  PortableTextBlock,
  ArbitraryTypedObject
} from '@portabletext/types';
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
  bio: InputValue;
  name: string;
  fullname: string;
  at: string;
  image: SanityImageObject;
  timeline: AuthorTimelineItem[];
  contact: InputValue;
}
