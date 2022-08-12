import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import dotenv from 'dotenv';

dotenv.config();

module SanityClient {
  export const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2022-07-25',
    useCdn: true
  });

  const builder = imageUrlBuilder(client);

  export const urlFor = (source: unknown) => builder.image(source);
}

export default SanityClient;
