import type { InputValue } from '@portabletext/svelte/ptTypes';
import type {
  ArbitraryTypedObject,
  PortableTextBlock
} from '@portabletext/types';

// Sanity types
export interface SanityAsset {
  _id?: string;
  _type?: string;
  url?: string;
  path?: string;
  assetId?: string;
  extension?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export interface SanityReference {
  _ref: string;
}
export interface SanityImageObject {
  asset: SanityReference | SanityAsset;
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
  icon?: () => Promise<PixelIcon>;
  text?: string;
  action?: () => void | Promise<void> | undefined;
}
export interface MenuState {
  open: boolean;
  pos: {
    x: number;
    y: number;
  };
  opts: MenuStateOpt[];
}

// Component types
export type PixelIcon = SvelteComponent | string | undefined;

// Data types
export interface Document extends SanityAsset {
  author?: AuthorDocument;
  slug:
  | SanityAsset
  | {
    current: string;
  };
  body: InputValue;
  date: string;
  desc?: string;
  tags?: [
    | SanityAsset
    | {
      slug:
      | SanityAsset
      | {
        current: string;
      };
      title: string;
    }
  ];
  title: string;
}

export interface AuthorDocument
  extends Omit<Document, 'tags' | 'desc' | 'title' | 'author'> {
  _id: string;
  _type: string;
  name: string;
  slug:
  | SanityAsset
  | {
    current: string;
  };
  image: SanityImageObject;
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
export interface ResData {
  meta: {
    count: string;
    filter: string;
  };
  data: Document;
}

export interface ResDataMany extends ResData {
  data: Document[];
}

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
