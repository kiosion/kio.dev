import { REMOTE_CDN_URL, SANITY_DATASET, SANITY_PROJECT_ID } from '$lib/env';

import imageUrlBuilder from '@sanity/image-url';

import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import type {
  FitMode,
  ImageFormat,
  SanityClientLike,
  SanityImageObject,
  SanityImageSource
} from '@sanity/image-url/lib/types/types';

export interface ImageCrop {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

const config: SanityClientLike = {
  clientConfig: {
    // TODO: Use Sanity CDN apiHost, need to fix CORS first
    apiHost: `${REMOTE_CDN_URL}`,
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET
  }
};

const builder = imageUrlBuilder(config);

export const urlFor = (source: SanityImageSource) => builder.image(source);

export const getCrop = (image: SanityImageObject | undefined) => {
  if (!image || !image?.asset) {
    return {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0
    };
  }
  const ref = image.asset._ref,
    dimensions = ref?.split('-')?.[2]?.split('x'),
    crop: ImageCrop = {
      top: Math.floor(dimensions[1] * (image?.crop?.top ?? 0)),
      left: Math.floor(dimensions[0] * (image?.crop?.left ?? 0)),
      bottom: Math.floor(dimensions[1] * (image?.crop?.bottom ?? 0)),
      right: Math.floor(dimensions[0] * (image?.crop?.right ?? 0))
    } as ImageCrop;

  crop.width = Math.floor(dimensions[0] - (crop.left + crop.right));
  crop.height = Math.floor(dimensions[1] - (crop.top + crop.bottom));

  return crop;
};

type baseBuildImageUrlOptions = {
  crop?: ImageCrop;
  width?: number;
  height?: number;
  blur?: number;
  fit?: FitMode;
  format?: ImageFormat;
};

type buildImageUrlOptions = baseBuildImageUrlOptions &
  (
    | {
        baseUrl: ImageUrlBuilder;
        ref?: never;
      }
    | {
        baseUrl?: never;
        ref: string;
      }
  );

export const buildImageUrl = (
  { baseUrl, ref, crop, width, height, blur, fit, format }: buildImageUrlOptions = {
    baseUrl: undefined
  } as buildImageUrlOptions
) => {
  if (!baseUrl) {
    if (!ref) {
      throw new Error('Either baseUrl or ref must be provided to buildImageUrl');
    }
    baseUrl = urlFor(ref);
  }
  if (crop) {
    baseUrl = baseUrl.rect(crop.left, crop.top, crop.width, crop.height).fit('crop');
  }
  if (width) {
    baseUrl = baseUrl.width(width);
  }
  if (height) {
    baseUrl = baseUrl.height(height);
  }
  if (blur && blur > 0) {
    baseUrl = baseUrl.blur(blur);
  }
  if (fit) {
    baseUrl = baseUrl.fit(fit);
  } else if (crop) {
    baseUrl = baseUrl.fit('crop');
  }
  if (format) {
    baseUrl = baseUrl.format(format);
  } else {
    baseUrl = baseUrl.auto('format');
  }
  return baseUrl.url();
};
