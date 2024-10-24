import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  SanityAsset,
  SanityImageObject
} from '$types/sanity';

interface ContentSection extends SanityAsset {
  title: string;
  content: (PortableTextBlock | ArbitraryTypedObject)[];
}

export type WorkTimelineItem = SanityAsset & {
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
};

export interface SiteConfig extends SanityAsset {
  name: string;
  image: SanityAsset & {
    dark: SanityImageObject;
    light: SanityImageObject;
  };
  handle?: string;
  bio?: string;
  enableToru?: boolean;
  about: ContentSection[];
  meta: ContentSection[];
  timeline: WorkTimelineItem[];
  socialLinks: {
    _key: string;
    name: string;
    url: string;
    internal: boolean;
    rel: ('noopener' | 'noreferrer' | 'me' | 'nofollow')[];
  }[];
  pgpKey?: string;
}
