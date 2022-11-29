import type { SanityAsset, SanityReference } from '$types/sanity';

export interface SiteConfig extends SanityAsset {
  title: string;
  indexHeading: string;
  indexSubheading: string;
  me: SanityReference;
  pgpKey?: string;
  pinnedPost?: SanityReference;
  pinnedProject?: SanityReference;
  socialLinks: {
    _key: string;
    name: string;
    url: string;
    internal: boolean;
    rel: ('noopener' | 'noreferrer' | 'me' | 'nofollow')[];
    icon: string;
    iconSize: number;
    iconRotation?: number;
  }[];
  commentsVisible: boolean;
  commentsRequireAuth: boolean;
  commentsRequireApproval: boolean;
  commentsEnabled: boolean;
}
