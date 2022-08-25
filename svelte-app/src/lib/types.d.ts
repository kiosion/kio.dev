import type { InputValue } from '@portabletext/svelte/ptTypes';
import type {
  ArbitraryTypedObject,
  PortableTextBlock
} from '@portabletext/types';

// Data types
export interface Document {
  _id: string;
  _type: string;
  author?: {
    _id: string;
    _type: string;
    name: string;
    slug: string;
    image: {
      _id: string;
      asset: {
        _ref: string;
      };
    };
  };
  slug: {
    _type: string;
    current: string;
  };
  body: InputValue;
  date: string;
  desc?: string;
  tags?: [
    {
      _id?: string;
      slug?: {
        _type: string;
        current: string;
      };
      title?: string;
    }
  ];
  title: string;
}

// Param types
export interface SingleDocumentQueryParams {
  slug: string;
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
