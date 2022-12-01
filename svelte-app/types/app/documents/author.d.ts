import type { SanityImageObject, InputValue } from '$types/sanity';
import type { Document } from '$types/documents';

export type AuthorTimelineItem = SanityAsset & {
  title: string;
  subtitle?: string;
  body?: InputValue;
  range: {
    start: string;
    end?: string;
  };
  skills?: SanityAsset &
    {
      slug: SanityAsset & { current: string };
      title: string;
    }[];
};

export interface AuthorDocument extends Omit<Document, 'slug' | 'date'> {
  bio: InputValue;
  name: string;
  image: SanityImageObject;
  timeline: AuthorTimelineItem[];
}
