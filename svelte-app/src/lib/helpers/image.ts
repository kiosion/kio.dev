import imageUrlBuilder from '@sanity/image-url';
import { SANITY_DATASET, SANITY_PROJECT_ID } from '$lib/env';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET
});

export const urlFor = (source: SanityImageSource) => builder.image(source);
