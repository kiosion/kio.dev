import imageUrlBuilder from '@sanity/image-url';
import { REMOTE_API_URL } from '$lib/env';
import type {
  SanityImageSource,
  SanityClientLike
} from '@sanity/image-url/lib/types/types';

const config: SanityClientLike = {
  clientConfig: {
    apiHost: `${REMOTE_API_URL}/cdn`,
    projectId: 'dataset', // This is kinda jank, should find a workaround to not include at all
    dataset: '0'
  }
};

const builder = imageUrlBuilder(config);

export const urlFor = (source: SanityImageSource) => builder.image(source);
