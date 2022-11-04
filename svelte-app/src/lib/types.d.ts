import type { InputValue } from '@portabletext/svelte/ptTypes';
import type {
  ArbitraryTypedObject,
  PortableTextBlock
} from '@portabletext/types';

// Sanity types
export interface SanityAsset {
  _id: string;
  _type?: string;
  _createdAt?: string;
  _rev?: string;
  _updatedAt?: string;
  url?: string;
  path?: string;
  assetId?: string;
  extension?: string;
}
export interface SanityReference {
  _ref: string;
  _type: string;
}
export interface SanityImageObject {
  asset: SanityReference;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
}
export interface SanityImageCrop {
  _type?: string;
  left: number;
  bottom: number;
  right: number;
  top: number;
}
export interface SanityImageHotspot {
  _type?: string;
  width: number;
  height: number;
  x: number;
  y: number;
}
export interface CodeBlockComponentProps
  extends Omit<BlockComponentProps, 'value'> {
  value: {
    _key: string;
    _type: string;
    code: string;
    language: string;
  };
}

// State types
export interface MenuStateOpt {
  disabled?: boolean;
  icon?: string;
  text?: string;
  action?: () => void | Promise<void> | undefined;
}
export interface MenuState {
  open: boolean;
  pos: {
    x: number;
    y: number;
  };
  target: HTMLElement;
  opts: MenuStateOpt[];
}

// Component types
export type PixelIcon = SvelteComponent | string | undefined;

// Data types
export interface Document extends SanityAsset {
  slug: SanityAsset & { current: string };
  body: InputValue;
  date: string;
}

export interface PostDocument extends Document {
  author?: {
    _id: string;
    _type: string;
    name: string;
    image: SanityImageObject;
    slug: SanityAsset & { current: string };
  };
  desc?: string;
  tags?: [
    SanityAsset & {
      slug: SanityAsset & { current: string };
      title: string;
    }
  ];
  title: string;
}

export interface AuthorDocument extends Document {
  bio: InputValue;
  name: string;
  image: SanityImageObject;
  timeline: AuthorTimelineItem[];
}

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
  tags?: [
    SanityAsset & {
      slug: SanityAsset & { current: string };
      title: string;
    }
  ];
  title: string;
}

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
    internal: boolean;
    title: string;
    link: string;
  }[];
  commentsVisible: boolean;
  commentsRequireAuth: boolean;
  commentsRequireApproval: boolean;
  commentsEnabled: boolean;
}

// Param types
export interface SingleDocumentQueryParams {
  slug?: string;
  id?: string;
}

export interface DocumentQueryParams {
  limit?: number;
  skip?: number;
  sort?: string;
  order?: string;
  date?: string;
  tags?: string[];
}

// Responses
export interface ResData<T> {
  meta: {
    count: string | number;
    total: string | number;
    filter: string;
  };
  data: T;
}

export interface ResError {
  code: string | number;
  error: string;
  status: string;
}

export interface ResDataMany<T> extends Omit<ResData, 'data'> {
  data: T[];
}

export type StoreRes<T> = T | undefined;

// PortableText types
export type TextBlock = PortableTextBlock;

export type ArbTypedObject = ArbitraryTypedObject;

// Sveltekit types
export interface RouteFetch {
  (info: RequestInfo, init?: RequestInit): Promise<Response>;
}

export type Subscriber<T> = (value: T) => void;

export type Unsubscriber = () => void;

export type Updater<T> = (value: T) => T;

export type Invalidator<T> = (value?: T) => void;
