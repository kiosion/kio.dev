import imageUrlBuilder from '@sanity/image-url';
import { REMOTE_CDN_URL } from '$lib/env';
import type {
  SanityImageSource,
  SanityClientLike,
  SanityImageObject
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
    apiHost: `${REMOTE_CDN_URL}`,
    projectId: 'dataset', // This is kinda jank, should find a workaround to not include at all
    dataset: '0'
  }
};

const builder = imageUrlBuilder(config);

export const urlFor = (source: SanityImageSource) => builder.image(source);

export const getCrop = (image: SanityImageObject | undefined) => {
  if (!image?.asset) {
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
