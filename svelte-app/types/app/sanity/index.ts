export type { InputValue } from '@portabletext/svelte/ptTypes';
export type { ArbitraryTypedObject, PortableTextBlock } from '@portabletext/types';

export interface SanityAsset {
  _id: string;
  _type: string;
  _createdAt: string;
  _rev: string;
  _updatedAt: string;
  url?: string;
  path?: string;
  assetId?: string;
  extension?: string;
}
export interface SanityReference {
  _ref: string;
  _type: string;
}
export interface SanityImageObject extends Pick<SanityAsset, '_id', '_type'> {
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

export * from '$types/sanity/pt';
