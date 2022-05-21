import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

module SanityClient {
  export const client = sanityClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    token: process.env.REACT_APP_SANITY_API_TOKEN,
    apiVersion: '2022-05-04',
    useCdn: true,
  });

  const builder = imageUrlBuilder(client);

  export const urlFor = (source: any) => builder.image(source);
}

export default SanityClient;
