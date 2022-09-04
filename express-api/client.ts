import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { SANITY_API_DATASET } from './lib/env';
import dotenv from 'dotenv';

dotenv.config();

export const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: SANITY_API_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2022-07-25',
  useCdn: true
});

module SanityClient {
  client;

  const builder = imageUrlBuilder(client);

  export const urlFor = (source: SanityImageSource) => builder.image(source);
}

export default SanityClient;
